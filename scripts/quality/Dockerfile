# Native x86_64 Ubuntu 24.04 test environment for the dedicated quality runner.
# The runner invokes this image with named cache volumes and an unprivileged UID.
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl gpg git python3 build-essential pkg-config \
    libgtk-3-dev libwebkit2gtk-4.1-dev libxdo-dev libssl-dev \
    xvfb xauth dbus-x11 squashfs-tools appstream desktop-file-utils \
    && install -d -m 0755 /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo 'deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main' > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y --no-install-recommends nodejs just \
    && rm -rf /var/lib/apt/lists/*

# Keep Chromium's OS libraries aligned with the locked Playwright version rather
# than maintaining a hand-written distribution package list.
COPY e2e/package.json e2e/package-lock.json /tmp/playwright/
RUN npm ci --prefix /tmp/playwright \
    && npx --prefix /tmp/playwright playwright install-deps chromium \
    && rm -rf /tmp/playwright

RUN install -d -o ubuntu -g ubuntu /cargo-home /cargo-target /npm-cache /playwright

USER ubuntu
ENV HOME=/home/ubuntu \
    CARGO_HOME=/cargo-home \
    CARGO_TARGET_DIR=/cargo-target \
    npm_config_cache=/npm-cache \
    PLAYWRIGHT_BROWSERS_PATH=/playwright \
    PATH=/cargo-home/bin:${PATH}
RUN curl --proto '=https' --tlsv1.2 --fail --silent --show-error https://sh.rustup.rs -sSf | sh -s -- -y --profile minimal \
    && rustup component add clippy rustfmt \
    && cargo install just --locked

WORKDIR /workspace
