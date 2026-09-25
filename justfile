# splash — a small multi-agent coding harness (Elyra: Rust + Svelte)

rata := env_var_or_default("RATA", "rata")
dev_data := "/tmp/splash-dev"

# Show available recipes
default:
    @just --list --unsorted

# Install what building and developing need: frontend deps and rata (Elyra's CLI)
[group('build')]
setup:
    cd app && npm ci
    @command -v {{ rata }} >/dev/null 2>&1 || cargo install --locked --git https://github.com/kwhorne/elyra-framework --tag v0.8.0 ratatosk
    @echo "splash: ready — the agents themselves (claude, codex, glue, pi, pool) are installed separately; check them with just detect"

# Start the app with hot reload (UI edits apply live; Rust changes need a restart)
[group('build')]
dev: _deps _rata
    {{ rata }} dev

# Launch the app from a fresh frontend build; folders passed are added as projects
[group('build')]
run *FOLDERS: frontend
    cargo run -- {{ FOLDERS }}

# Build the Svelte frontend into app/dist (embedded by the Rust binary)
[group('build')]
frontend: _deps
    cd app && npm run build

# Build the frontend and the app
[group('build')]
build: frontend
    cargo build

# Regenerate app/src/bindings.ts after changing a command or event type
[group('build')]
codegen: _rata
    {{ rata }} codegen

# Remove build output (keeps app/dist, which rust-embed needs to exist)
[group('build')]
clean:
    cargo clean
    find app/dist -mindepth 1 ! -name .gitkeep -delete

# Run all tests (mapper fixtures, actor vs fake-acp, store, workspace, pty)
[group('qa')]
test:
    cargo test

# Format the Rust code
[group('qa')]
fmt:
    cargo fmt --all

# Check formatting, run clippy, keep every UI colour a CSS token, the focus ring intact and em dashes out of UI copy
[group('qa')]
lint:
    cargo fmt --all --check
    cargo clippy --all-targets -- -D warnings
    scripts/check-colors.sh
    cd app && npm run check
    scripts/check-focus.sh
    scripts/check-copy.sh

# Full gate: lint + test
[group('qa')]
check: lint test

# Serve the real backend + UI on :4780 for headless browser testing (own data dir)
[group('harness')]
web *FOLDERS: frontend
    SPLASH_DATA_DIR={{ dev_data }} cargo run --bin splash-web -- --port 4780 {{ FOLDERS }}

# Drive one agent headless over ACP; --record NAME writes fixtures/<agent>/NAME.jsonl
[group('harness')]
spike agent dir prompt *FLAGS:
    cargo run --bin spike -- {{ agent }} {{ dir }} "{{ prompt }}" {{ FLAGS }}

# Detect every agent and run the free ACP handshake probe
[group('harness')]
detect:
    cargo run --bin spike -- --detect

[private]
_deps:
    @[ -d app/node_modules ] || (cd app && npm ci)

[private]
_rata:
    @command -v {{ rata }} >/dev/null 2>&1 || { echo "splash: rata not found — run just setup (or set RATA=/path/to/rata)" >&2; exit 1; }
