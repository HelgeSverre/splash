#!/usr/bin/env python3
"""Wait for a real webview to render and report readiness; isolated data only."""
from pathlib import Path
import os
import subprocess
import sys
import tempfile
import time

with tempfile.TemporaryDirectory(prefix='splash-desktop-') as directory:
    marker = Path(directory) / 'ready'
    env = {**os.environ, 'SPLASH_DATA_DIR': str(Path(directory) / 'data'), 'SPLASH_SMOKE_READY': str(marker)}
    with open(Path(directory) / 'stderr', 'w+') as log:
        process = subprocess.Popen([str(Path(sys.argv[1]).resolve())], env=env, stdout=log, stderr=log)
        try:
            for _ in range(600):
                if marker.exists():
                    assert marker.read_text() == 'frontend-ready'
                    print('Native desktop renderer loaded, IPC round-trip and initial render passed')
                    break
                if process.poll() is not None: raise RuntimeError(f'Desktop exited {process.returncode}')
                time.sleep(0.1)
            else: raise RuntimeError('Webview never reported readiness')
        except BaseException:
            log.flush(); log.seek(0); print(log.read(), file=sys.stderr)
            raise
        finally:
            process.terminate()
            try: process.wait(timeout=10)
            except subprocess.TimeoutExpired: process.kill(); process.wait()
