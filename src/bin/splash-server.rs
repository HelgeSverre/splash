fn main() {
    let args: Vec<_> = std::env::args().skip(1).collect();
    if args.iter().any(|a| a == "--help" || a == "-h") {
        println!("{}", splash::server::HELP);
        return;
    }
    if args.iter().any(|a| a == "--version" || a == "-V") {
        println!("splash-server {}", env!("CARGO_PKG_VERSION"));
        return;
    }
    let result = splash::server::Options::parse(args)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error + Send + Sync>)
        .and_then(splash::server::run);
    if let Err(e) = result {
        eprintln!("splash-server: {e}");
        std::process::exit(1);
    }
}
