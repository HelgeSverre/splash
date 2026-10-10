FROM ubuntu:24.04
# Keep Splash's runtime libraries out of the fixture.  The DEB installation
# below must resolve its declared dependencies on a clean Ubuntu host.
RUN apt-get update && apt-get install -y --no-install-recommends python3 xvfb xauth dbus-x11 ca-certificates binutils && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --uid 1001 smoke
COPY scripts/test-desktop.py scripts/test-server-http.py /opt/tests/
COPY packaging/smoke-linux.sh /opt/tests/smoke.sh
ENTRYPOINT ["bash", "/opt/tests/smoke.sh"]
