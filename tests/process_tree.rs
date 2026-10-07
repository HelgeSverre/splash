use splash::{
    acp::transport,
    agents::{registry::AuthCheck, AgentSpec, Transport},
};
use std::{sync::Arc, time::Duration};

#[tokio::test(flavor = "multi_thread")]
async fn terminating_an_agent_stops_its_descendants_with_spaced_unicode_paths() {
    let dir = std::env::temp_dir().join(splash::store::new_id("splash space ü"));
    std::fs::create_dir(&dir).unwrap();
    let heartbeat = dir.join("child heartbeat.txt");
    let spec = AgentSpec {
        id: "tree",
        name: "Tree fixture",
        cli: env!("CARGO_BIN_EXE_fake-acp"),
        program: env!("CARGO_BIN_EXE_fake-acp"),
        args: &[],
        env: &[],
        transport: Transport::Native,
        experimental: false,
        auth: AuthCheck::None,
    };
    let (transport, mut process) = transport::spawn(
        &spec,
        &dir,
        &[
            "--spawn-heartbeat-child".into(),
            heartbeat.to_string_lossy().into_owned(),
        ],
        Arc::new(|_, _| {}),
    )
    .unwrap();
    let deadline = std::time::Instant::now() + Duration::from_secs(10);
    while !heartbeat.exists() && std::time::Instant::now() < deadline {
        tokio::time::sleep(Duration::from_millis(20)).await;
    }
    assert!(heartbeat.exists(), "grandchild never started");
    process.kill();
    if let Some(mut child) = process.child.take() {
        tokio::time::timeout(Duration::from_secs(5), child.wait())
            .await
            .unwrap()
            .unwrap();
    }
    drop(transport);
    tokio::time::sleep(Duration::from_secs(2)).await;
    let size = std::fs::metadata(&heartbeat).unwrap().len();
    tokio::time::sleep(Duration::from_millis(200)).await;
    assert_eq!(
        std::fs::metadata(&heartbeat).unwrap().len(),
        size,
        "grandchild survived termination"
    );
    std::fs::remove_dir_all(dir).unwrap();
}

#[tokio::test(flavor = "multi_thread")]
async fn cancelling_detection_stops_its_descendants() {
    let dir = std::env::temp_dir().join(splash::store::new_id("splash-cancel"));
    std::fs::create_dir(&dir).unwrap();
    let heartbeat = dir.join("cancelled heartbeat.txt");
    let mut command = tokio::process::Command::new(env!("CARGO_BIN_EXE_fake-acp"));
    command.arg("--spawn-heartbeat-child").arg(&heartbeat);
    let task = tokio::spawn(splash::procs::output_with_timeout(
        command,
        Duration::from_secs(60),
    ));
    let deadline = std::time::Instant::now() + Duration::from_secs(10);
    while !heartbeat.exists() && std::time::Instant::now() < deadline {
        tokio::time::sleep(Duration::from_millis(20)).await;
    }
    assert!(heartbeat.exists(), "grandchild never started");
    task.abort();
    let _ = task.await;
    tokio::time::sleep(Duration::from_secs(2)).await;
    let size = std::fs::metadata(&heartbeat).unwrap().len();
    tokio::time::sleep(Duration::from_millis(200)).await;
    assert_eq!(std::fs::metadata(&heartbeat).unwrap().len(), size);
    std::fs::remove_dir_all(dir).unwrap();
}
