"""Exercise the real archive packager with isolated signing/network tool fixtures."""

import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAKE_TOOL = r"""#!/usr/bin/env python3
import json
import os
from pathlib import Path
import shutil
import sys

name = Path(sys.argv[0]).name
args = sys.argv[1:]
state_file = Path(os.environ['FIXTURE_STATE'])
state = json.loads(state_file.read_text())
state['calls'].append([name, *args])
state_file.write_text(json.dumps(state))
if name == 'plutil' and args[0] == '-extract':
    print({'CFBundleIdentifier': 'no.helgesverre.splash', 'status': 'Accepted'}.get(args[1], '0.2.3'))
elif name == 'ditto':
    if '-x' in args:
        dest = Path(args[-1]) / 'Splash.app'
        shutil.copytree(os.environ['FIXTURE_APP'], dest)
    else:
        Path(args[-1]).write_bytes(b'isolated archive fixture')
elif name == 'xcrun':
    if args[:2] == ['notarytool', 'submit']:
        print(json.dumps({'status': 'Accepted', 'id': 'fixture-submission'}))
    elif args[:2] == ['stapler', 'staple']:
        attempts = sum(c[:3] == ['xcrun', 'stapler', 'staple'] for c in state['calls'])
        if os.environ.get('FIXTURE_PERMANENT'):
            print('The code signature is invalid', file=sys.stderr)
            sys.exit(65)
        if attempts <= int(os.environ.get('FIXTURE_FAILURES', '0')):
            print('Error Domain=NSURLErrorDomain Code=-1005 "The network connection was lost."', file=sys.stderr)
            sys.exit(68)
    elif args[:2] == ['stapler', 'validate'] and os.environ.get('FIXTURE_VALIDATE_FAILURE'):
        print('The ticket does not validate', file=sys.stderr)
        sys.exit(65)
elif name == 'spctl' and os.environ.get('FIXTURE_GATEKEEPER_FAILURE'):
    sys.exit(3)
"""


class NotarizationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="splash-notary-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.bin = self.root / "bin"
        self.bin.mkdir()
        for name in ("plutil", "codesign", "ditto", "xcrun", "spctl", "sleep"):
            tool = self.bin / name
            tool.write_text(FAKE_TOOL)
            tool.chmod(0o755)
        self.app = self.root / "input with spaces" / "Splash.app"
        executable = self.app / "Contents" / "MacOS" / "splash"
        executable.parent.mkdir(parents=True)
        executable.write_text("fixture executable")
        executable.chmod(0o755)
        resources = self.app / "Contents" / "Resources"
        resources.mkdir()
        (resources / "AppIcon.icns").write_bytes(b"fixture icon")
        self.state = self.root / "calls.json"
        self.state.write_text(json.dumps({"calls": []}))
        self.output = self.root / "output" / "Splash.zip"
        self.env = dict(
            os.environ,
            PATH=str(self.bin) + os.pathsep + os.environ["PATH"],
            FIXTURE_STATE=str(self.state),
            FIXTURE_APP=str(self.app),
            APPLE_APPLICATION_SIGNING_IDENTITY="Developer ID Application: Fixture",
            APPLE_NOTARY_PROFILE="isolated-fixture",
        )

    def package(self, **options):
        return subprocess.run(
            [
                "bash",
                str(ROOT / "scripts/package-release.sh"),
                str(self.app),
                str(self.output),
            ],
            env=dict(self.env, **options),
            capture_output=True,
            text=True,
            timeout=15,
            check=False,
        )

    def calls(self, *prefix):
        return [
            call
            for call in json.loads(self.state.read_text())["calls"]
            if call[: len(prefix)] == list(prefix)
        ]

    def test_transient_staple_failure_retries_without_resubmitting_or_resigning(self):
        result = self.package(FIXTURE_FAILURES="2")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(self.calls("xcrun", "stapler", "staple")), 3)
        self.assertEqual(len(self.calls("xcrun", "notarytool", "submit")), 1)
        self.assertEqual(len([c for c in self.calls("codesign") if "--sign" in c]), 1)
        self.assertEqual(len(self.calls("xcrun", "stapler", "validate")), 2)
        self.assertEqual(len(self.calls("spctl")), 2)
        self.assertTrue(self.output.exists())
        self.assertTrue(Path(str(self.output) + ".sha256").exists())

    def test_permanent_staple_error_fails_without_retry_or_archive(self):
        result = self.package(FIXTURE_PERMANENT="1")
        self.assertEqual(result.returncode, 65)
        self.assertEqual(len(self.calls("xcrun", "stapler", "staple")), 1)
        self.assertEqual(self.calls("sleep"), [])
        self.assertFalse(self.output.exists())

    def test_network_retry_exhaustion_fails_closed(self):
        result = self.package(FIXTURE_FAILURES="99")
        self.assertEqual(result.returncode, 68, result.stderr)
        self.assertEqual(len(self.calls("xcrun", "stapler", "staple")), 5)
        self.assertEqual(
            self.calls("sleep"),
            [["sleep", "5"], ["sleep", "10"], ["sleep", "20"], ["sleep", "40"]],
        )
        self.assertEqual(len(self.calls("xcrun", "notarytool", "submit")), 1)
        self.assertFalse(self.output.exists())

    def test_ticket_validation_remains_mandatory_after_stapling(self):
        result = self.package(FIXTURE_VALIDATE_FAILURE="1")
        self.assertEqual(result.returncode, 65)
        self.assertEqual(len(self.calls("xcrun", "stapler", "staple")), 1)
        self.assertEqual(len(self.calls("xcrun", "stapler", "validate")), 1)
        self.assertFalse(self.output.exists())

    def test_gatekeeper_assessment_remains_mandatory(self):
        result = self.package(FIXTURE_GATEKEEPER_FAILURE="1")
        self.assertEqual(result.returncode, 3)
        self.assertFalse(self.output.exists())

    def test_installer_ticket_uses_the_same_bounded_retry(self):
        package = self.root / "Fixture Installer.pkg"
        package.write_bytes(b"fixture installer")
        result = subprocess.run(
            [
                "bash",
                "-c",
                'source "$1"; staple_notarized "$2"',
                "fixture",
                str(ROOT / "scripts/notary-retry.sh"),
                str(package),
            ],
            env=dict(self.env, FIXTURE_FAILURES="2"),
            capture_output=True,
            text=True,
            timeout=15,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            self.calls("xcrun", "stapler", "staple"),
            [["xcrun", "stapler", "staple", str(package)]] * 3,
        )
        self.assertEqual(self.calls("xcrun", "notarytool"), [])


if __name__ == "__main__":
    unittest.main()
