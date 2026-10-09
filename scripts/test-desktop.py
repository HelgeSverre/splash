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
                    screenshot = os.environ.get('SPLASH_SMOKE_SCREENSHOT')
                    if screenshot:
                        # Frontend readiness is emitted before the compositor's
                        # next paint; let the Xvfb root window receive it.
                        time.sleep(1)
                        import gi
                        gi.require_version('Gdk', '3.0')
                        from gi.repository import Gdk

                        root = Gdk.get_default_root_window()
                        image = Gdk.pixbuf_get_from_window(root, 0, 0, root.get_width(), root.get_height())
                        if image is None:
                            raise RuntimeError('Could not capture the desktop root window')
                        image.savev(screenshot, 'png', [], [])
                        print(f'Captured native desktop screenshot: {screenshot}')
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
