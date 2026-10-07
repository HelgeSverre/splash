#!/usr/bin/env python3
"""Real HTTP smoke test; isolated state, no display, no agent prompts."""
import http.cookiejar
import json
import os
from pathlib import Path
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

binary = str(Path(sys.argv[1]).resolve())
assert 'splash-server' in subprocess.check_output([binary, '--version'], text=True)
assert 'ssh -N' in subprocess.check_output([binary, '--help'], text=True)
with tempfile.TemporaryDirectory(prefix='splash-http-') as directory:
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        port = sock.getsockname()[1]
    url = f'http://127.0.0.1:{port}'
    env = dict(os.environ)
    env.pop('DISPLAY', None)
    process = subprocess.Popen([binary, '--port', str(port), '--data-dir', directory, '--name', 'HTTP test'], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    try:
        for _ in range(200):
            try:
                with urllib.request.urlopen(url, timeout=1) as page:
                    assert b'Connect to your workspace' in page.read()
                break
            except urllib.error.URLError:
                if process.poll() is not None:
                    raise RuntimeError(process.stderr.read().decode())
                time.sleep(0.05)
        else:
            raise RuntimeError('Server failed to start')
        duplicate = subprocess.run([binary, '--port', '1', '--data-dir', directory], env=env, capture_output=True, timeout=10)
        assert duplicate.returncode != 0 and b'Another Splash server' in duplicate.stderr
        token = Path(directory, 'server.token').read_text()
        browser = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        login = urllib.request.Request(url + '/login', token.encode(), {'Origin': url, 'Content-Type': 'text/plain'})
        assert browser.open(login, timeout=5).status == 204
        with browser.open(url + '/__server/state', timeout=5) as response:
            assert json.load(response)['name'] == 'HTTP test'
        with browser.open(url, timeout=5) as response:
            assert b'/server-bridge.js' in response.read()
        bad = urllib.request.Request(url + '/__server/state', headers={'Origin': 'https://other.example'})
        try:
            browser.open(bad, timeout=5)
            raise AssertionError('Foreign origin was accepted')
        except urllib.error.HTTPError as error:
            assert error.code == 403
        print('HTTP server: login, authenticated assets/state, origin checks and headless startup passed')
    finally:
        process.terminate()
        process.wait(timeout=10)
