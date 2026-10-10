use http::{Request, StatusCode};
use splash::server::{Options, WebServer};
#[cfg(unix)]
use std::os::unix::fs::PermissionsExt;
use std::{
    io::{Read, Write},
    net::{TcpListener, TcpStream},
    path::PathBuf,
    process::{Child, Command, Stdio},
    sync::mpsc,
    time::Duration,
};

struct TestServer {
    dir: PathBuf,
    app: WebServer,
    token: String,
}
impl TestServer {
    fn new() -> Self {
        let dir = std::env::temp_dir().join(splash::store::new_id("splash-server-test"));
        let app = WebServer::new(&Options {
            data_dir: dir.clone(),
            ..Options::default()
        })
        .unwrap();
        let token = std::fs::read_to_string(dir.join("server.token")).unwrap();
        Self { dir, app, token }
    }
    fn request(&self, path: &str, method: &str, auth: bool, body: Vec<u8>) -> Request<Vec<u8>> {
        let mut r = Request::builder()
            .uri(path)
            .method(method)
            .header("host", "127.0.0.1:4780");
        if auth {
            r = r.header(
                "cookie",
                format!("splash_auth_{}={}", &self.token[..12], self.token),
            );
        }
        r.body(body).unwrap()
    }
    async fn ipc_token(&self) -> String {
        let r = self
            .app
            .handle(self.request("/__server/state", "GET", true, vec![]))
            .await;
        serde_json::from_slice::<serde_json::Value>(r.body()).unwrap()["token"]
            .as_str()
            .unwrap()
            .into()
    }
}
impl Drop for TestServer {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.dir);
    }
}

struct ServerProcess(Child);

impl Drop for ServerProcess {
    fn drop(&mut self) {
        let _ = self.0.kill();
        let _ = self.0.wait();
    }
}

fn free_port() -> u16 {
    let listener = TcpListener::bind(("127.0.0.1", 0)).unwrap();
    listener.local_addr().unwrap().port()
}

fn complete_response_len(response: &[u8]) -> std::io::Result<Option<usize>> {
    let Some(headers_end) = response.windows(4).position(|window| window == b"\r\n\r\n") else {
        return Ok(None);
    };
    let headers = std::str::from_utf8(&response[..headers_end]).map_err(|error| {
        std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            format!("response headers were not UTF-8: {error}"),
        )
    })?;
    let status = headers
        .split_whitespace()
        .nth(1)
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::InvalidData, "missing status"))?
        .parse::<u16>()
        .map_err(|error| {
            std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                format!("invalid response status: {error}"),
            )
        })?;
    if (100..200).contains(&status) || matches!(status, 204 | 304) {
        return Ok(Some(headers_end + 4));
    }
    let length = headers
        .lines()
        .find_map(|line| {
            line.split_once(':')
                .filter(|(key, _)| key.eq_ignore_ascii_case("content-length"))
        })
        .ok_or_else(|| {
            std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                "response did not include Content-Length",
            )
        })?
        .1
        .trim()
        .parse::<usize>()
        .map_err(|error| {
            std::io::Error::new(
                std::io::ErrorKind::InvalidData,
                format!("invalid Content-Length: {error}"),
            )
        })?;
    Ok(Some(headers_end + 4 + length))
}

fn read_response(stream: &mut TcpStream, timeout: Duration) -> std::io::Result<Vec<u8>> {
    stream.set_read_timeout(Some(timeout))?;
    let mut response = Vec::new();
    loop {
        if let Some(expected) = complete_response_len(&response)? {
            if response.len() >= expected {
                response.truncate(expected);
                return Ok(response);
            }
        }
        let mut chunk = [0; 1024];
        let read = stream.read(&mut chunk)?;
        if read == 0 {
            return Err(std::io::Error::new(
                std::io::ErrorKind::UnexpectedEof,
                "connection closed before a complete response",
            ));
        }
        response.extend_from_slice(&chunk[..read]);
    }
}

fn http(port: u16, request: &[u8], timeout: Duration, phase: &str) -> Vec<u8> {
    let mut stream = TcpStream::connect(("127.0.0.1", port)).unwrap();
    stream.write_all(request).unwrap();
    stream.shutdown(std::net::Shutdown::Write).unwrap();
    read_response(&mut stream, timeout).unwrap_or_else(|error| {
        panic!("{phase}: incomplete HTTP response after {timeout:?}: {error}")
    })
}

fn status(response: &[u8]) -> u16 {
    std::str::from_utf8(http_headers(response))
        .unwrap()
        .split_whitespace()
        .nth(1)
        .unwrap()
        .parse()
        .unwrap()
}

fn body(response: &[u8]) -> &[u8] {
    response
        .windows(4)
        .position(|window| window == b"\r\n\r\n")
        .map(|at| &response[at + 4..])
        .unwrap()
}

fn http_headers(response: &[u8]) -> &[u8] {
    response
        .windows(4)
        .position(|window| window == b"\r\n\r\n")
        .map(|at| &response[..at])
        .unwrap()
}

fn header(response: &[u8], name: &str) -> String {
    let text = std::str::from_utf8(http_headers(response)).unwrap();
    text.lines()
        .find_map(|line| {
            line.split_once(':')
                .filter(|(key, _)| key.eq_ignore_ascii_case(name))
        })
        .map(|(_, value)| value.trim().to_owned())
        .unwrap()
}

fn list_sessions_request(port: u16, cookie: &str, ipc: &str, client: &str) -> Vec<u8> {
    let mut request = format!(
        "POST /__cmd/list_sessions HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\nCookie: {cookie}\r\nx-elyra-token: {ipc}\r\nx-elyra-client-id: {client}\r\nContent-Type: application/msgpack\r\nContent-Length: 1\r\n\r\n"
    )
    .into_bytes();
    request.push(0x90); // MessagePack's empty argument array.
    request
}

#[tokio::test(flavor = "multi_thread")]
async fn auth_protects_assets_commands_and_state_and_logout_clears_cookie() {
    let s = TestServer::new();
    for path in [
        "/__server/state",
        "/__cmd/list_sessions",
        "/server-bridge.js",
        "/icon.png",
    ] {
        let method = if path.contains("/__cmd/") {
            "POST"
        } else {
            "GET"
        };
        assert_eq!(
            s.app
                .handle(s.request(path, method, false, vec![]))
                .await
                .status(),
            StatusCode::UNAUTHORIZED
        );
    }
    let page = s.app.handle(s.request("/", "GET", false, vec![])).await;
    assert!(String::from_utf8_lossy(page.body()).contains("Connect to your workspace"));
    assert!(!String::from_utf8_lossy(page.body()).contains(&s.token));
    assert!(page.headers()["content-security-policy"]
        .to_str()
        .unwrap()
        .contains("frame-ancestors 'none'"));
    assert_eq!(
        s.app
            .handle(s.request("/login", "POST", false, b"wrong".to_vec()))
            .await
            .status(),
        StatusCode::UNAUTHORIZED
    );
    let login = s
        .app
        .handle(s.request("/login", "POST", false, s.token.as_bytes().to_vec()))
        .await;
    assert_eq!(login.status(), StatusCode::NO_CONTENT);
    let cookie = login.headers()["set-cookie"].to_str().unwrap();
    assert!(cookie.contains("HttpOnly") && cookie.contains("SameSite=Strict"));
    let logout = s
        .app
        .handle(s.request("/logout", "POST", true, vec![]))
        .await;
    assert!(logout.headers()["set-cookie"]
        .to_str()
        .unwrap()
        .contains("Max-Age=0"));
    assert_eq!(
        s.app
            .handle(s.request("/__sys/clipboard/read", "POST", true, vec![]))
            .await
            .status(),
        StatusCode::NOT_IMPLEMENTED
    );
}

#[tokio::test(flavor = "multi_thread")]
async fn rejects_foreign_origins_rebinding_get_commands_and_oversized_requests() {
    let s = TestServer::new();
    for (name, value) in [
        ("origin", "https://evil.example"),
        ("origin", "null"),
        ("host", "evil.example:4780"),
        ("sec-fetch-site", "cross-site"),
    ] {
        let mut request = s.request("/__server/state", "GET", true, vec![]);
        request.headers_mut().insert(name, value.parse().unwrap());
        assert_eq!(s.app.handle(request).await.status(), StatusCode::FORBIDDEN);
    }
    assert_eq!(
        s.app
            .handle(s.request("/__cmd/list_sessions", "GET", true, vec![]))
            .await
            .status(),
        StatusCode::FORBIDDEN
    );
    assert_eq!(
        s.app
            .handle(s.request("/login", "POST", false, vec![0; 2 * 1024 * 1024 + 1]))
            .await
            .status(),
        StatusCode::PAYLOAD_TOO_LARGE
    );
    // A tunnel may use a different local port than the server port.
    let mut forwarded = s.request("/__server/state", "GET", true, vec![]);
    forwarded
        .headers_mut()
        .insert("host", "localhost:9000".parse().unwrap());
    forwarded
        .headers_mut()
        .insert("origin", "http://localhost:9000".parse().unwrap());
    assert_eq!(s.app.handle(forwarded).await.status(), StatusCode::OK);
}

#[tokio::test(flavor = "multi_thread")]
async fn serves_real_commands_and_refreshes_ipc_identity_after_restart() {
    let s = TestServer::new();
    let ipc = s.ipc_token().await;
    let mut request = s.request(
        "/__cmd/list_sessions",
        "POST",
        true,
        rmp_serde::to_vec(&()).unwrap(),
    );
    request
        .headers_mut()
        .insert("x-elyra-token", ipc.parse().unwrap());
    let response = s.app.handle(request).await;
    assert_eq!(response.status(), StatusCode::OK);
    let sessions: Vec<serde_json::Value> = rmp_serde::from_slice(response.body()).unwrap();
    assert!(sessions.is_empty());
    let page = s.app.handle(s.request("/", "GET", true, vec![])).await;
    assert!(String::from_utf8_lossy(page.body()).contains("/server-bridge.js"));
    assert!(!String::from_utf8_lossy(page.body()).contains(&s.token));
    let restarted = WebServer::new(&Options {
        data_dir: s.dir.clone(),
        ..Options::default()
    })
    .unwrap();
    let response = restarted
        .handle(s.request("/__server/state", "GET", true, vec![]))
        .await;
    assert_eq!(response.status(), StatusCode::OK);
    let state: serde_json::Value = serde_json::from_slice(response.body()).unwrap();
    assert_ne!(state["token"].as_str().unwrap(), ipc);
    #[cfg(unix)]
    assert_eq!(
        std::fs::metadata(s.dir.join("server.token"))
            .unwrap()
            .permissions()
            .mode()
            & 0o777,
        0o600
    );
}

#[test]
fn cli_validation_and_server_folder_paths() {
    let parse = |args: &[&str]| Options::parse(args.iter().map(|s| s.to_string()));
    assert!(parse(&["--port", "0"]).is_err());
    assert!(parse(&["--port", "65536"]).is_err());
    assert!(parse(&["--bind", "0.0.0.0"]).is_err());
    assert!(parse(&["--data-dir"]).is_err());
    let o = parse(&[
        "--port",
        "5000",
        "--name",
        "Build machine",
        "--",
        "/work/my project",
    ])
    .unwrap();
    assert_eq!(o.folders, ["/work/my project"]);
    assert_eq!(o.port, 5000);
    assert!(splash::server::folders::browse(Some("relative/path")).is_err());
    let gone = std::env::temp_dir().join(format!("splash-missing-{}", std::process::id()));
    let missing = splash::server::folders::browse(gone.to_str())
        .unwrap_err()
        .to_string();
    assert!(
        missing.contains("No folder exists at that path"),
        "{missing}"
    );
    let dir = std::env::temp_dir().join(splash::store::new_id("server-folders"));
    std::fs::create_dir_all(dir.join("my project")).unwrap();
    std::fs::write(dir.join("not a directory"), "test").unwrap();
    let listing = splash::server::folders::browse(dir.to_str()).unwrap();
    assert_eq!(listing.folders.len(), 1);
    assert!(listing.folders[0].ends_with("my project"));
    assert!(!listing.truncated);
    std::fs::remove_dir_all(dir).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn different_servers_can_share_a_browser_cookie_jar() {
    let a = TestServer::new();
    let b = TestServer::new();
    let mut cookies = vec![];
    for s in [&a, &b] {
        let response = s
            .app
            .handle(s.request("/login", "POST", false, s.token.as_bytes().to_vec()))
            .await;
        cookies.push(
            response.headers()["set-cookie"]
                .to_str()
                .unwrap()
                .split(';')
                .next()
                .unwrap()
                .to_string(),
        );
    }
    assert_ne!(cookies[0].split('=').next(), cookies[1].split('=').next());
    for s in [&a, &b] {
        let mut request = s.request("/__server/state", "GET", false, vec![]);
        request
            .headers_mut()
            .insert("cookie", cookies.join("; ").parse().unwrap());
        assert_eq!(s.app.handle(request).await.status(), StatusCode::OK);
    }
}

/// A window loads its state with commands, then starts polling for events. An
/// event in between must still reach it, even while another window is
/// connected: the window's queue exists from its first command.
#[tokio::test]
async fn events_between_a_windows_first_command_and_first_poll_reach_it() {
    let s = TestServer::new();
    let ipc = s.ipc_token().await;
    let call = |path: &str, client: &str, body: Vec<u8>| {
        let mut r = s.request(path, "POST", true, body);
        r.headers_mut()
            .insert("x-elyra-token", ipc.parse().unwrap());
        r.headers_mut()
            .insert("x-elyra-client-id", client.parse().unwrap());
        r
    };
    // Another window is already listening.
    let _ = tokio::time::timeout(
        std::time::Duration::from_millis(100),
        s.app.handle(call("/__events", "first-window", vec![])),
    )
    .await;
    // A new window loads its projects, ...
    let r = s
        .app
        .handle(call(
            "/__cmd/list_projects",
            "new-window",
            rmp_serde::to_vec(&()).unwrap(),
        ))
        .await;
    assert_eq!(r.status(), StatusCode::OK);
    // ... a project is added before it polls ...
    let folder = s.dir.join("project");
    std::fs::create_dir_all(&folder).unwrap();
    let r = s
        .app
        .handle(call(
            "/__cmd/add_project",
            "first-window",
            rmp_serde::to_vec(&(folder.to_string_lossy(),)).unwrap(),
        ))
        .await;
    assert_eq!(r.status(), StatusCode::OK);
    // ... and its first poll brings that event.
    let batch = tokio::time::timeout(
        std::time::Duration::from_secs(2),
        s.app.handle(call("/__events", "new-window", vec![])),
    )
    .await
    .expect("the event was queued for the new window");
    let events: Vec<(String, serde_json::Value)> = rmp_serde::from_slice(batch.body()).unwrap();
    assert!(
        events.iter().any(|(channel, _)| channel == "project"),
        "{events:?}"
    );
}

#[test]
fn idle_event_polls_leave_capacity_for_commands() {
    let data = std::env::temp_dir().join(splash::store::new_id("splash-server-polls"));
    let port = free_port();
    let mut server = ServerProcess(
        Command::new(env!("CARGO_BIN_EXE_splash-server"))
            .args(["--port", &port.to_string(), "--data-dir"])
            .arg(&data)
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .unwrap(),
    );

    let deadline = std::time::Instant::now() + Duration::from_secs(5);
    loop {
        if TcpStream::connect(("127.0.0.1", port)).is_ok() {
            break;
        }
        assert!(std::time::Instant::now() < deadline, "server did not start");
        std::thread::sleep(Duration::from_millis(10));
    }

    let token = loop {
        match std::fs::read_to_string(data.join("server.token")) {
            Ok(token) => break token.trim().to_owned(),
            Err(_) => std::thread::sleep(Duration::from_millis(10)),
        }
    };
    let login = http(
        port,
        format!(
            "POST /login HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\nContent-Length: {}\r\n\r\n{token}",
            token.len()
        )
        .as_bytes(),
        Duration::from_secs(2),
        "login before capacity test",
    );
    assert_eq!(status(&login), 204);
    let cookie = header(&login, "set-cookie")
        .split(';')
        .next()
        .unwrap()
        .to_owned();
    let state = http(
        port,
        format!(
            "GET /__server/state HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\nCookie: {cookie}\r\n\r\n"
        )
        .as_bytes(),
        Duration::from_secs(2),
        "read server state before capacity test",
    );
    assert_eq!(status(&state), 200);
    let ipc = serde_json::from_slice::<serde_json::Value>(body(&state)).unwrap()["token"]
        .as_str()
        .unwrap()
        .to_owned();

    // The first command initializes the store. Run it before the long polls
    // so a slow clean Windows setup cannot look like permit starvation.
    let warm_command = http(
        port,
        &list_sessions_request(port, &cookie, &ipc, "capacity-warmup"),
        Duration::from_secs(8),
        "warm list_sessions before event polls",
    );
    assert_eq!(
        status(&warm_command),
        200,
        "warm list_sessions failed before any event poll was open"
    );

    // A long poll occupies a worker until an event arrives. More clients than
    // the old shared 32-worker pool must still leave command capacity.
    let (started, ready) = mpsc::channel();
    let (event_status, event_statuses) = mpsc::channel();
    let mut polls = Vec::new();
    for client in 0..64 {
        let cookie = cookie.clone();
        let ipc = ipc.clone();
        let started = started.clone();
        let event_status = event_status.clone();
        polls.push(std::thread::spawn(move || {
            let mut stream = TcpStream::connect(("127.0.0.1", port)).unwrap();
            let request = format!("GET /__events HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nCookie: {cookie}\r\nx-elyra-token: {ipc}\r\nx-elyra-client-id: poll-{client}\r\nContent-Length: 0\r\n\r\n");
            stream.write_all(request.as_bytes()).unwrap();
            stream.shutdown(std::net::Shutdown::Write).unwrap();
            started.send(()).unwrap();
            if let Ok(response) = read_response(&mut stream, Duration::from_secs(3)) {
                let _ = event_status.send(status(&response));
            }
        }));
    }
    for _ in 0..64 {
        ready.recv_timeout(Duration::from_secs(1)).unwrap();
    }
    // Do not merely assume the server has admitted the polls. An overflow
    // response proves the event pool is occupied before the command begins.
    let deadline = std::time::Instant::now() + Duration::from_secs(2);
    loop {
        match event_statuses.recv_timeout(Duration::from_millis(50)) {
            Ok(503) => break,
            Ok(_) => continue,
            Err(mpsc::RecvTimeoutError::Timeout) => {
                assert!(
                    std::time::Instant::now() < deadline,
                    "event pool did not fill"
                );
            }
            Err(mpsc::RecvTimeoutError::Disconnected) => panic!("event polls disconnected"),
        }
    }

    let command = http(
        port,
        &list_sessions_request(port, &cookie, &ipc, "capacity-command"),
        Duration::from_secs(2),
        "list_sessions after confirmed event-pool saturation",
    );
    assert_eq!(
        status(&command),
        200,
        "list_sessions was rejected after the event pool was proven full"
    );

    server.0.kill().unwrap();
    server.0.wait().unwrap();
    for poll in polls {
        poll.join().unwrap();
    }
    std::fs::remove_dir_all(data).unwrap();
}
