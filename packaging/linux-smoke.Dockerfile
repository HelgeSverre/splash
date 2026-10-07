FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends python3 libgtk-3-0t64 libwebkit2gtk-4.1-0 libxdo3 libssl3t64 xvfb xauth dbus-x11 ca-certificates binutils && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --uid 1001 smoke
COPY scripts/test-desktop.py scripts/test-server-http.py /opt/tests/
COPY packaging/smoke-linux.sh /opt/tests/smoke.sh
USER smoke
WORKDIR /home/smoke
ENTRYPOINT ["bash", "/opt/tests/smoke.sh"]
