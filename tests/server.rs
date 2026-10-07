use http::{Request, StatusCode};
use splash::server::{Options, WebServer};
use std::{os::unix::fs::PermissionsExt, path::PathBuf};

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
