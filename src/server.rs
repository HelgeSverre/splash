//! Single-user HTTP entry point. Bind only to loopback; use SSH for remote access.
//! Reuses the desktop command router, with a separate web authentication boundary.
use elyra::testing::TestShell;
use http::{Request, Response, StatusCode};
use serde::Serialize;
use std::{
    io::{self, Read, Write},
    net::{IpAddr, SocketAddr},
    path::PathBuf,
    sync::Arc,
};
pub mod folders;

const MAX_BODY: u64 = 2 * 1024 * 1024;
const CSP: &str = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";

#[derive(Debug)]
pub struct Options {
    pub port: u16,
    pub data_dir: PathBuf,
    pub name: String,
    pub folders: Vec<String>,
}
impl Default for Options {
    fn default() -> Self {
        Self {
            port: 4780,
            data_dir: std::env::var_os("SPLASH_DATA_DIR")
                .map(PathBuf::from)
                .unwrap_or_else(|| crate::app::data_dir().with_file_name("SplashServer")),
            name: "Splash server".into(),
            folders: vec![],
        }
    }
}

pub const HELP: &str = "Splash server\n\nUsage: splash-server [OPTIONS] [FOLDER...]\n\nOptions:\n  --port PORT       Loopback port (default: 4780)\n  --data-dir PATH   Database, worktrees and server token (or SPLASH_DATA_DIR)\n  --name NAME       Display name for this machine\n  --help, -h        Show help\n  --version, -V     Show version\n\nRemote access: ssh -N -L 127.0.0.1:4780:127.0.0.1:4780 HOST\nThe login token is stored in DATA_DIR/server.token (owner-readable only).\nRun as a user service to keep work running when the browser disconnects.";

impl Options {
    pub fn parse(args: impl IntoIterator<Item = String>) -> io::Result<Self> {
        let mut result = Self::default();
        let mut args = args.into_iter();
        while let Some(arg) = args.next() {
            match arg.as_str() {
                "--" => {
                    result.folders.extend(args);
                    break;
                }
                "--port" => {
                    result.port = args
                        .next()
                        .ok_or_else(|| invalid("--port needs a value"))?
                        .parse()
                        .map_err(|_| invalid("--port must be between 1 and 65535"))?;
                    if result.port == 0 {
                        return Err(invalid("--port must be between 1 and 65535"));
                    }
                }
                "--data-dir" => {
                    result.data_dir = PathBuf::from(
                        args.next()
                            .ok_or_else(|| invalid("--data-dir needs a path"))?,
                    )
                }
                "--name" => {
                    result.name = args
                        .next()
                        .filter(|s| !s.trim().is_empty())
                        .ok_or_else(|| invalid("--name needs a name"))?
                }
                _ if arg.starts_with('-') => {
                    return Err(invalid(format!("Unknown option {arg}; use --help")))
                }
                _ => result.folders.push(arg),
            }
        }
        Ok(result)
    }
}
fn invalid(message: impl Into<String>) -> io::Error {
    io::Error::new(io::ErrorKind::InvalidInput, message.into())
}

/// Stable across service restarts, never included in application HTML or URLs.
fn load_token(dir: &std::path::Path) -> io::Result<String> {
    use std::os::unix::fs::{OpenOptionsExt, PermissionsExt};
    std::fs::create_dir_all(dir)?;
    let path = dir.join("server.token");
    match std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(0o600)
        .open(&path)
    {
        Ok(mut file) => {
            let token = format!(
                "{}{}",
                uuid::Uuid::new_v4().simple(),
                uuid::Uuid::new_v4().simple()
            );
            file.write_all(token.as_bytes())?;
            file.sync_all()?;
            Ok(token)
        }
        Err(e) if e.kind() == io::ErrorKind::AlreadyExists => {
            let meta = std::fs::symlink_metadata(&path)?;
            if !meta.is_file() || meta.permissions().mode() & 0o077 != 0 {
                return Err(invalid(
                    "server.token must be a regular owner-only file; use chmod 600",
                ));
            }
            let token = std::fs::read_to_string(path)?.trim().to_string();
            if token.len() != 64 || !token.bytes().all(|c| c.is_ascii_hexdigit()) {
                return Err(invalid(
                    "Invalid server.token; expected 64 hexadecimal characters",
                ));
            }
            Ok(token)
        }
        Err(e) => Err(e),
    }
}

#[derive(Serialize)]
struct ServerInfo<'a> {
    name: &'a str,
    instance: &'a str,
    token: &'a str,
    version: &'a str,
}

pub struct WebServer {
    shell: TestShell,
    token: String,
    instance: String,
    name: String,
}
impl WebServer {
    pub fn new(options: &Options) -> io::Result<Self> {
        let token = load_token(&options.data_dir)?;
        Ok(Self {
            shell: TestShell::new(
                crate::app::build(options.data_dir.clone(), options.folders.clone()).prepare(),
            ),
            token,
            instance: uuid::Uuid::new_v4().to_string(),
            name: options.name.clone(),
        })
    }

    fn cookie_name(&self) -> String {
        format!("splash_auth_{}", &self.token[..12])
    }

    fn authenticated(&self, request: &Request<Vec<u8>>) -> bool {
        request
            .headers()
            .get("cookie")
            .and_then(|v| v.to_str().ok())
            .is_some_and(|cookies| {
                cookies
                    .split(';')
                    .filter_map(|c| c.trim().split_once('='))
                    .any(|(key, value)| key == self.cookie_name() && equal(value, &self.token))
            })
    }

    pub async fn handle(&self, mut request: Request<Vec<u8>>) -> Response<Vec<u8>> {
        let response = if let Err(message) = check_origin(&request) {
            response(StatusCode::FORBIDDEN, "text/plain", message)
        } else if request.body().len() as u64 > MAX_BODY {
            response(
                StatusCode::PAYLOAD_TOO_LARGE,
                "text/plain",
                "Request is too large",
            )
        } else {
            let path = request.uri().path().to_string();
            if path == "/login.js" && request.method() == "GET" {
                response(
                    StatusCode::OK,
                    "text/javascript",
                    include_str!("server/login.js"),
                )
            } else if path == "/login" && request.method() == "POST" {
                if equal(
                    std::str::from_utf8(request.body())
                        .unwrap_or_default()
                        .trim(),
                    &self.token,
                ) {
                    let mut r = response(StatusCode::NO_CONTENT, "text/plain", "");
                    if let Ok(cookie) = format!(
                        "{}={}; HttpOnly; SameSite=Strict; Path=/",
                        self.cookie_name(),
                        self.token
                    )
                    .parse()
                    {
                        r.headers_mut().insert("set-cookie", cookie);
                    }
                    r
                } else {
                    response(
                        StatusCode::UNAUTHORIZED,
                        "text/plain",
                        "The token did not match. Copy it from this server's server.token file.",
                    )
                }
            } else if !self.authenticated(&request) {
                if path == "/" && request.method() == "GET" {
                    response(
                        StatusCode::OK,
                        "text/html",
                        include_str!("server/login.html"),
                    )
                } else {
                    response(
                        StatusCode::UNAUTHORIZED,
                        "text/plain",
                        "Sign in to this Splash server",
                    )
                }
            } else if path == "/logout" && request.method() == "POST" {
                let mut r = response(StatusCode::NO_CONTENT, "text/plain", "");
                r.headers_mut().insert(
                    "set-cookie",
                    http::HeaderValue::from_str(&format!(
                        "{}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0",
                        self.cookie_name()
                    ))
                    .expect("cookie name contains only hexadecimal characters"),
                );
                r
            } else if path == "/__server/state" && request.method() == "GET" {
                match serde_json::to_string(&ServerInfo {
                    name: &self.name,
                    instance: &self.instance,
                    token: self.shell.token(),
                    version: env!("CARGO_PKG_VERSION"),
                }) {
                    Ok(body) => response(StatusCode::OK, "application/json", body),
                    Err(_) => response(
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "text/plain",
                        "Could not read server state",
                    ),
                }
            } else if path == "/server-bridge.js" && request.method() == "GET" {
                response(
                    StatusCode::OK,
                    "text/javascript",
                    include_str!("server/bridge.js"),
                )
            } else if path.starts_with("/__sys/") || path.starts_with("/__window/") {
                // Never operate the server's clipboard, file dialogs, or desktop.
                response(
                    StatusCode::NOT_IMPLEMENTED,
                    "text/plain",
                    "This action is only available in the desktop app",
                )
            } else if path.starts_with("/__")
                && !path.starts_with("/__cmd/")
                && path != "/__events"
                && path != "/__about"
                && path != "/__cancel"
            {
                response(
                    StatusCode::NOT_FOUND,
                    "text/plain",
                    "Unknown server endpoint",
                )
            } else {
                // Cached HTML must never carry stale initialization state.
                request.headers_mut().remove("if-none-match");
                request.headers_mut().remove("if-modified-since");
                let routed = self.shell.handle(request).await;
                let (mut parts, body) = routed.into_parts();
                let is_html = parts
                    .headers
                    .get("content-type")
                    .and_then(|v| v.to_str().ok())
                    .is_some_and(|v| v.starts_with("text/html"));
                let bytes = if is_html {
                    String::from_utf8_lossy(&body)
                        .replacen(
                            "<head>",
                            "<head><script src=\"/server-bridge.js\"></script>",
                            1,
                        )
                        .into_bytes()
                } else {
                    body.into_owned()
                };
                parts.headers.remove("content-length");
                parts.headers.remove("etag");
                Response::from_parts(parts, bytes)
            }
        };
        secure_headers(response)
    }
}

fn equal(a: &str, b: &str) -> bool {
    a.len() == b.len() && a.bytes().zip(b.bytes()).fold(0u8, |d, (a, b)| d | (a ^ b)) == 0
}
fn loopback_host(host: &str) -> bool {
    host.parse::<http::uri::Authority>().ok().is_some_and(|a| {
        let h = a.host().trim_start_matches('[').trim_end_matches(']');
        h.eq_ignore_ascii_case("localhost") || h.parse::<IpAddr>().is_ok_and(|ip| ip.is_loopback())
    })
}
fn check_origin(request: &Request<Vec<u8>>) -> Result<(), &'static str> {
    let host = request
        .headers()
        .get("host")
        .and_then(|v| v.to_str().ok())
        .ok_or("Missing Host")?;
    if !loopback_host(host) {
        return Err("Use localhost or a loopback address through an SSH tunnel");
    }
    if let Some(origin) = request.headers().get("origin") {
        let expected = format!("http://{host}");
        if origin.to_str().ok() != Some(expected.as_str()) {
            return Err("Cross-origin requests are not allowed");
        }
    }
    if request
        .headers()
        .get("sec-fetch-site")
        .is_some_and(|v| v == "cross-site")
    {
        return Err("Cross-site requests are not allowed");
    }
    if !matches!(request.method().as_str(), "GET" | "HEAD" | "POST") {
        return Err("Unsupported method");
    }
    if request.uri().path().starts_with("/__cmd/") && request.method() != "POST" {
        return Err("Commands require POST");
    }
    Ok(())
}
fn response(
    status: StatusCode,
    content_type: &'static str,
    body: impl AsRef<[u8]>,
) -> Response<Vec<u8>> {
    let mut r = Response::new(body.as_ref().to_vec());
    *r.status_mut() = status;
    r.headers_mut()
        .insert("content-type", http::HeaderValue::from_static(content_type));
    r
}
fn secure_headers(mut response: Response<Vec<u8>>) -> Response<Vec<u8>> {
    let headers = response.headers_mut();
    headers.insert(
        "content-security-policy",
        http::HeaderValue::from_static(CSP),
    );
    headers.insert("cache-control", http::HeaderValue::from_static("no-store"));
    headers.insert(
        "x-content-type-options",
        http::HeaderValue::from_static("nosniff"),
    );
    headers.insert(
        "referrer-policy",
        http::HeaderValue::from_static("no-referrer"),
    );
    headers.remove("access-control-allow-origin");
    response
}

/// Serve independently of browser connections. The service owns agent lifetimes.
pub fn run(options: Options) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    use std::os::unix::fs::OpenOptionsExt;
    std::fs::create_dir_all(&options.data_dir)?;
    let lock = std::fs::OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .truncate(false)
        .mode(0o600)
        .open(options.data_dir.join("server.lock"))?;
    lock.try_lock()
        .map_err(|_| invalid("Another Splash server is using this data directory"))?;
    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()?;
    let app = {
        let _guard = rt.enter();
        Arc::new(WebServer::new(&options)?)
    };
    let server = tiny_http::Server::http(SocketAddr::from(([127, 0, 0, 1], options.port)))?;
    eprintln!(
        "{} on http://127.0.0.1:{}\nLogin token: {}",
        options.name,
        options.port,
        options.data_dir.join("server.token").display()
    );
    let permits = Arc::new(tokio::sync::Semaphore::new(32));
    for mut req in server.incoming_requests() {
        let Ok(permit) = permits.clone().try_acquire_owned() else {
            let _ = req.respond(
                tiny_http::Response::from_string("Too many concurrent requests")
                    .with_status_code(503),
            );
            continue;
        };
        let app = app.clone();
        let handle = rt.handle().clone();
        std::thread::spawn(move || {
            let _permit = permit;
            let mut body = Vec::new();
            if req
                .as_reader()
                .take(MAX_BODY + 1)
                .read_to_end(&mut body)
                .is_err()
            {
                return;
            }
            let mut builder = Request::builder()
                .method(req.method().as_str())
                .uri(req.url());
            for h in req.headers() {
                builder = builder.header(h.field.as_str().as_str(), h.value.as_str());
            }
            let Ok(request) = builder.body(body) else {
                return;
            };
            let (parts, body) = handle.block_on(app.handle(request)).into_parts();
            let mut response =
                tiny_http::Response::from_data(body).with_status_code(parts.status.as_u16());
            for (name, value) in &parts.headers {
                if let Ok(header) =
                    tiny_http::Header::from_bytes(name.as_str().as_bytes(), value.as_bytes())
                {
                    response.add_header(header);
                }
            }
            let _ = req.respond(response);
        });
    }
    Ok(())
}
