//! Dev harness: the real Splash backend and UI over plain HTTP, for driving
//! with a headless browser — no window, nothing on the user's screen.
//!
//! SPLASH_DATA_DIR=/tmp/splash-dev cargo run --bin splash-web -- [--port 4780] [folder…]
//!
//! Requests go through Elyra's own protocol handler (`TestShell`), so commands,
//! the event long-poll and asset serving are exactly what the app runs. The
//! page gets a small shim: the IPC token, and `fetch` rewritten from
//! `elyra://localhost` to this origin. Native dialogs and notifications are
//! stubbed out so nothing pops up on the desktop.

use std::sync::Arc;

use elyra::testing::TestShell;

const SHIM: &str = r#"<script>
globalThis.__ELYRA__ = Object.freeze({ token: "__TOKEN__" });
(() => {
  const f = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (input, init) => {
    if (typeof input === "string" && input.startsWith("elyra://localhost")) input = location.origin + input.slice(17);
    return f(input, init);
  };
})();
</script>"#;

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let port = args
        .iter()
        .position(|a| a == "--port")
        .and_then(|i| args.get(i + 1))
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(4780);
    let folders: Vec<String> = args
        .iter()
        .enumerate()
        .filter(|(i, a)| !a.starts_with("--") && (*i == 0 || args[i - 1] != "--port"))
        .map(|(_, a)| a.clone())
        .collect();

    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .expect("runtime");
    let shell = {
        let _guard = rt.enter();
        Arc::new(TestShell::new(
            splash::app::build(splash::app::data_dir(), folders).prepare(),
        ))
    };
    let token = shell.token().to_string();
    let server = tiny_http::Server::http(("127.0.0.1", port)).expect("bind");
    eprintln!(
        "splash-web on http://127.0.0.1:{port}  (data: {})",
        splash::app::data_dir().display()
    );

    for mut req in server.incoming_requests() {
        let shell = shell.clone();
        let handle = rt.handle().clone();
        let token = token.clone();
        std::thread::spawn(move || {
            let path = req.url().to_string();
            let mut body = Vec::new();
            let _ = req.as_reader().read_to_end(&mut body);

            if let Some(stub) = native_stub(&path) {
                let _ = req.respond(msgpack(stub));
                return;
            }

            let mut builder = http::Request::builder()
                .method(req.method().as_str())
                .uri(format!("elyra://localhost{path}"));
            for h in req.headers() {
                // Always serve fresh: a cached page would carry a stale token.
                let name = h.field.as_str().as_str().to_ascii_lowercase();
                if name == "if-none-match" || name == "if-modified-since" {
                    continue;
                }
                builder = builder.header(h.field.as_str().as_str(), h.value.as_str());
            }
            let Ok(request) = builder.body(body) else {
                return;
            };
            let response = handle.block_on(shell.handle(request));

            let status = response.status().as_u16();
            let is_html = response
                .headers()
                .get("content-type")
                .and_then(|v| v.to_str().ok())
                .is_some_and(|v| v.starts_with("text/html"));
            let mut headers = Vec::new();
            for (k, v) in response.headers() {
                // The app's CSP would block the shim; this harness is local-only.
                if k == "content-security-policy"
                    || k == "content-length"
                    || k == "etag"
                    || k == "cache-control"
                {
                    continue;
                }
                if let Ok(h) = tiny_http::Header::from_bytes(k.as_str().as_bytes(), v.as_bytes()) {
                    headers.push(h);
                }
            }
            headers.push(tiny_http::Header::from_bytes("cache-control", "no-store").unwrap());
            let mut bytes = response.into_body().into_owned();
            if is_html {
                let html = String::from_utf8_lossy(&bytes);
                let shim = SHIM.replace("__TOKEN__", &token);
                bytes = html
                    .replacen("<head>", &format!("<head>{shim}"), 1)
                    .into_bytes();
            }
            let resp = tiny_http::Response::new(
                tiny_http::StatusCode(status),
                headers,
                std::io::Cursor::new(bytes.clone()),
                Some(bytes.len()),
                None,
            );
            let _ = req.respond(resp);
        });
    }
}

/// Native desktop routes answered with inert values: an empty file dialog, no
/// notification, no external open.
fn native_stub(path: &str) -> Option<&'static [u8]> {
    if !path.starts_with("/__sys/") {
        return None;
    }
    // msgpack: 0x90 = [], 0xc0 = nil
    Some(if path.contains("dialog") {
        &[0x90]
    } else {
        &[0xc0]
    })
}

fn msgpack(bytes: &'static [u8]) -> tiny_http::Response<std::io::Cursor<Vec<u8>>> {
    let mut r = tiny_http::Response::from_data(bytes.to_vec());
    r.add_header(tiny_http::Header::from_bytes("content-type", "application/msgpack").unwrap());
    r.add_header(tiny_http::Header::from_bytes("x-elyra-status", "ok").unwrap());
    r
}
