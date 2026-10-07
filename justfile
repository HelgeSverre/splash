# splash — a small multi-agent coding harness (Elyra: Rust + Svelte)

set windows-shell := ["bash", "-cu"]

rata := env_var_or_default("RATA", "rata")
dev_data := env_var_or_default("SPLASH_DEV_DATA_DIR", join(env_var_or_default("TEMP", "/tmp"), "splash-dev"))

# Show available recipes
default:
    @just --list --unsorted

# Install what building and developing need: frontend deps and rata (Elyra's CLI)
[group('build')]
setup:
    cd app && npm ci
    @command -v {{ rata }} >/dev/null 2>&1 || cargo install --locked --git https://github.com/kwhorne/elyra-framework --tag v0.8.0 ratatosk
    @echo "splash: ready. Agents are installed separately; check them with just detect"

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

# Re-render every app icon from app/public/icon.svg (needs resvg, Pillow and macOS iconutil)
[group('build')]
icons:
    python3 scripts/generate-icons.py

# Remove build output (keeps app/dist, which rust-embed needs to exist)
[group('build')]
clean:
    cargo clean
    find app/dist -mindepth 1 ! -name .gitkeep -delete

# Run all tests (mapper fixtures, actor vs fake-acp, store, workspace, pty)
[group('qa')]
test:
    cargo test --no-fail-fast

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

# Check notarization credentials and GitHub release settings
[group('release')]
release-status:
    python3 scripts/release.py status

# Check, build, sign, notarize and verify a local release ZIP (does not publish)
[group('release')]
release: frontend check _rata
    {{ rata }} build
    {{ rata }} bundle
    python3 scripts/release.py package

# Serve the real backend + UI on :4780 for headless browser testing (own data dir)
[group('harness')]
web *FOLDERS: frontend
    SPLASH_DATA_DIR="{{ dev_data }}" cargo run --bin splash-web -- --port 4780 {{ FOLDERS }}

# Single-user server; use an SSH tunnel for remote access.
[group('server')]
serve *ARGS: frontend
    cargo run --bin splash-server -- {{ ARGS }}

[group('server')]
server-build: frontend
    cargo build --release --no-default-features --bin splash-server

# Drive one agent headless over ACP; --record NAME writes fixtures/<agent>/NAME.jsonl
[group('harness')]
spike agent dir prompt *FLAGS:
    cargo run --bin spike -- {{ agent }} {{ dir }} "{{ prompt }}" {{ FLAGS }}

# Detect every agent and run the free ACP handshake probe
[group('harness')]
detect:
    cargo run --bin spike -- --detect

# Marketing site with hot reload; renders the app's components on demo data (website/)
[group('website')]
site:
    @[ -d website/node_modules ] || (cd website && bun install --frozen-lockfile)
    cd website && bun run dev

# Type-check and build the static marketing site into website/build
[group('website')]
site-build:
    @[ -d website/node_modules ] || (cd website && bun install --frozen-lockfile)
    cd website && bun run check && bun run build

# Recapture the site's share cards into website/static/og (needs Google Chrome or CHROME_PATH)
[group('website')]
site-og:
    @[ -d website/node_modules ] || (cd website && bun install --frozen-lockfile)
    cd website && bun run og

[private]
_deps:
    @[ -d app/node_modules ] || (cd app && npm ci)

[private]
_rata:
    @command -v {{ rata }} >/dev/null 2>&1 || { echo "splash: rata not found — run just setup (or set RATA=/path/to/rata)" >&2; exit 1; }
