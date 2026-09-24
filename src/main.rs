fn main() -> elyra::Result<()> {
    let folders: Vec<String> = std::env::args()
        .skip(1)
        .filter(|a| !a.starts_with('-'))
        .collect();
    splash::app::build(splash::app::data_dir(), folders).run()
}
