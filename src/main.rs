#![cfg_attr(all(windows, not(debug_assertions)), windows_subsystem = "windows")]

fn main() -> elyra::Result<()> {
    if std::env::args().any(|arg| arg == "--version") {
        println!("Splash {}", env!("CARGO_PKG_VERSION"));
        return Ok(());
    }
    if std::env::args().any(|arg| arg == "--help") {
        println!("Splash [FOLDERS...]\nDesktop workspace for ACP agents. Use splash-server for headless operation.");
        return Ok(());
    }
    let folders: Vec<String> = std::env::args()
        .skip(1)
        .filter(|a| !a.starts_with('-'))
        .collect();
    splash::app::build(splash::app::data_dir(), folders).run()
}
