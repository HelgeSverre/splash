"""Regression checks for credential setup; no network or real credentials."""

import argparse
import contextlib
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import release


IDENTITY = "Developer ID Application: Test Company (TESTTEAM01)"
INSTALLER_IDENTITY = "Developer ID Installer: Test Company (TESTTEAM01)"


class SetupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name)
        self.password = root / "password.txt"
        self.password.write_text("test-only-password\n")
        self.certificate = root / "application.p12"
        self.certificate.write_bytes(b"test certificate")
        self.installer = root / "installer.p12"
        self.installer.write_bytes(b"test installer certificate")
        self.key = root / "AuthKey_TESTKEY123.p8"
        self.key.write_bytes(b"test notary key")
        self.args = argparse.Namespace(
            password_file=self.password, application_p12=self.certificate,
            installer_p12=self.installer, installer_password_file=None,
            notary_key=self.key, key_id=None,
            issuer_id="00000000-0000-0000-0000-000000000000", issuer_file=None,
            repo="test/splash", profile="test-splash", apply=False,
        )

    def response(self, command, **kwargs):
        if command[:2] == ["openssl", "version"]:
            return b"OpenSSL 3.0.0"
        if command[:2] == ["openssl", "pkcs12"]:
            kind = b"installer " if any(arg.endswith("installer.p12") for arg in command) else b""
            return b"private fixture" if "-nocerts" in command else kind + b"certificate fixture"
        if "-pubkey" in command or "-pubout" in command:
            return b"matching public key"
        if "-subject" in command:
            identity = INSTALLER_IDENTITY if kwargs.get("data", b"").startswith(b"installer") else IDENTITY
            return f"    commonName = {identity}\n".encode()
        if command[:2] == ["security", "find-identity"]:
            return f'1) TEST "{IDENTITY}"'.encode()
        return b"{}"

    def test_validation_only_has_no_writes(self):
        with patch.object(release, "run", side_effect=self.response) as run, \
                patch.object(release, "write_config") as write, \
                contextlib.redirect_stdout(io.StringIO()):
            release.setup(self.args)
        write.assert_not_called()
        calls = [call.args[0] for call in run.call_args_list]
        self.assertFalse(any("set" in cmd or "store-credentials" in cmd for cmd in calls))

    def test_mismatched_private_key_prevents_writes(self):
        def mismatch(command, **kwargs):
            return b"wrong key" if "-pubout" in command else self.response(command, **kwargs)

        self.args.apply = True
        with patch.object(release, "run", side_effect=mismatch) as run, \
                patch.object(release, "write_config") as write:
            with self.assertRaisesRegex(RuntimeError, "do not match"):
                release.setup(self.args)
        write.assert_not_called()
        self.assertFalse(any(call.args[0][0] in {"gh", "xcrun"} for call in run.call_args_list))

    def test_apply_transfers_secrets_only_through_stdin(self):
        self.args.apply = True
        output = io.StringIO()
        with patch.object(release, "run", side_effect=self.response) as run, \
                patch.object(release, "write_config") as write, \
                patch.object(release, "status"), contextlib.redirect_stdout(output):
            release.setup(self.args)
        calls = [call for call in run.call_args_list if call.args[0][:3] == ["gh", "secret", "set"]]
        self.assertEqual({call.args[0][3] for call in calls}, release.SECRET_NAMES)
        for call in calls:
            value = call.kwargs["data"].decode()
            self.assertNotIn(value, output.getvalue())
            self.assertNotIn(value, " ".join(call.args[0]))
        config = json.dumps(write.call_args.args[0])
        self.assertNotIn("test-only-password", config)
        self.assertNotIn("test notary key", config)
        self.assertEqual(write.call_args.args[0]["variables"]["APPLE_INSTALLER_SIGNING_IDENTITY"], INSTALLER_IDENTITY)

    def test_failed_command_redacts_arguments_and_output(self):
        failure = subprocess.CompletedProcess([], 1, b"secret stdout", b"secret stderr")
        with patch.object(release.subprocess, "run", return_value=failure):
            with self.assertRaises(RuntimeError) as result:
                release.run(["openssl", "pkcs12", "secret argument"])
        self.assertEqual(str(result.exception), "openssl pkcs12 failed (exit 1)")


if __name__ == "__main__":
    unittest.main()
