#!/usr/bin/env python3
"""Configure shared signing assets and package a local Splash release."""

import argparse
import base64
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import time
import uuid

ROOT = Path(__file__).resolve().parent.parent
CONFIG = Path(os.environ.get("SPLASH_RELEASE_CONFIG", Path.home() / ".config/splash/release.json"))
SECRET_NAMES = {
    "APPLE_APPLICATION_CERTIFICATE_BASE64",
    "APPLE_APPLICATION_CERTIFICATE_PASSWORD",
    "APPLE_INSTALLER_CERTIFICATE_BASE64",
    "APPLE_INSTALLER_CERTIFICATE_PASSWORD",
    "APPLE_NOTARY_KEY_BASE64",
}
VARIABLE_NAMES = {
    "APPLE_APPLICATION_SIGNING_IDENTITY",
    "APPLE_INSTALLER_SIGNING_IDENTITY",
    "APPLE_NOTARY_KEY_ID",
    "APPLE_NOTARY_ISSUER_ID",
}


def run(args, *, data=None, env=None):
    """Capture output: commands handling private keys must never echo it."""
    result = subprocess.run(args, input=data, capture_output=True, env=env, cwd=ROOT)
    if result.returncode:
        # Do not include command arguments or output: either may contain secrets.
        raise RuntimeError(f"{args[0]} {args[1]} failed (exit {result.returncode})")
    return result.stdout


def read_config():
    if not CONFIG.is_file():
        raise RuntimeError("Run scripts/release.py setup --help to configure signing first")
    return json.loads(CONFIG.read_text())


def write_config(config):
    CONFIG.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", dir=CONFIG.parent, delete=False) as f:
        temporary = Path(f.name)
        json.dump(config, f, indent=2)
        f.write("\n")
    try:
        temporary.replace(CONFIG)
    finally:
        temporary.unlink(missing_ok=True)


def read_password(path):
    password = path.read_bytes().rstrip(b"\r\n")
    if not password or b"\n" in password or b"\r" in password:
        raise RuntimeError("Certificate password file must contain one nonempty line")
    return password


def p12_identity(path, password, kind):
    """Check a .p12 holds an unexpired Developer ID `kind` certificate with its own key; return the identity."""
    # Old Keychain exports use legacy encryption. OpenSSL 3 needs -legacy;
    # Apple's LibreSSL does not recognize that flag.
    legacy = ["-legacy"] if run(["openssl", "version"]).startswith(b"OpenSSL 3.") else []
    p12 = ["openssl", "pkcs12", *legacy, "-in", str(path), "-passin", "stdin"]
    certificate = run([*p12, "-clcerts", "-nokeys"], data=password + b"\n")
    private_key = run([*p12, "-nocerts", "-nodes"], data=password + b"\n")
    public_from_cert = run(["openssl", "x509", "-pubkey", "-noout"], data=certificate)
    public_from_key = run(["openssl", "pkey", "-pubout"], data=private_key)
    if public_from_cert != public_from_key:
        raise RuntimeError(f"{kind} certificate and private key do not match")
    run(["openssl", "x509", "-checkend", "0", "-noout"], data=certificate)
    subject = run(["openssl", "x509", "-subject", "-noout", "-nameopt", "multiline"], data=certificate).decode()
    match = re.search(rf"commonName\s*=\s*(Developer ID {kind}: .+)", subject)
    if not match:
        raise RuntimeError(f"Expected a Developer ID {kind} certificate")
    return match[1].strip()


def setup(args):
    # Read secrets directly into memory; never put their values in argv or logs.
    password = read_password(args.password_file)
    installer_password = read_password(args.installer_password_file or args.password_file)
    certificate_path = args.application_p12.resolve()
    installer_path = args.installer_p12.resolve()
    key_path = args.notary_key.resolve()
    key_id = args.key_id
    if not key_id:
        match = re.fullmatch(r"AuthKey_([A-Za-z0-9]+)\.p8", key_path.name)
        if not match:
            raise RuntimeError("Use an AuthKey_KEYID.p8 filename or provide --key-id")
        key_id = match[1]
    issuer = str(uuid.UUID(args.issuer_id or args.issuer_file.read_text().strip()))

    identity = p12_identity(certificate_path, password, "Application")
    installer_identity = p12_identity(installer_path, installer_password, "Installer")
    installed = run(["security", "find-identity", "-v", "-p", "codesigning"]).decode()
    if f'"{identity}"' not in installed:
        raise RuntimeError("Import this Developer ID identity into Keychain before setup")
    run(["openssl", "pkey", "-in", str(key_path), "-check", "-noout"])
    auth = ["--key", str(key_path), "--key-id", key_id, "--issuer", issuer]
    run(["xcrun", "notarytool", "history", *auth, "--output-format", "json"])
    repo = args.repo or json.loads(run(["gh", "repo", "view", "--json", "nameWithOwner"]))["nameWithOwner"]
    run(["gh", "repo", "view", repo, "--json", "nameWithOwner"])
    print(f"Validated certificates, matching private keys, and Apple authentication.\nRepository: {repo}\nIdentity: {identity}\nInstaller identity: {installer_identity}", flush=True)
    if not args.apply:
        print("Validation only. Add --apply to configure GitHub and the local Keychain profile.")
        return

    profile = args.profile
    run(["xcrun", "notarytool", "store-credentials", profile, *auth, "--validate"])
    secrets = {
        "APPLE_APPLICATION_CERTIFICATE_BASE64": base64.b64encode(certificate_path.read_bytes()),
        "APPLE_APPLICATION_CERTIFICATE_PASSWORD": password,
        "APPLE_INSTALLER_CERTIFICATE_BASE64": base64.b64encode(installer_path.read_bytes()),
        "APPLE_INSTALLER_CERTIFICATE_PASSWORD": installer_password,
        "APPLE_NOTARY_KEY_BASE64": base64.b64encode(key_path.read_bytes()),
    }
    for name, value in secrets.items():
        run(["gh", "secret", "set", name, "--repo", repo], data=value)
        print(f"Configured secret: {name}", flush=True)
    variables = {
        "APPLE_APPLICATION_SIGNING_IDENTITY": identity,
        "APPLE_INSTALLER_SIGNING_IDENTITY": installer_identity,
        "APPLE_NOTARY_KEY_ID": key_id,
        "APPLE_NOTARY_ISSUER_ID": issuer,
    }
    for name, value in variables.items():
        run(["gh", "variable", "set", name, "--repo", repo], data=value.encode())
    write_config({"repository": repo, "identity": identity, "profile": profile, "variables": variables})
    status(args)


def status(_args):
    config = read_config()
    installed = run(["security", "find-identity", "-v", "-p", "codesigning"]).decode()
    if f'"{config["identity"]}"' not in installed:
        raise RuntimeError("Configured Developer ID identity is missing from Keychain")
    run(["xcrun", "notarytool", "history", "--keychain-profile", config["profile"], "--output-format", "json"])
    for kind, expected in [("secret", SECRET_NAMES), ("variable", VARIABLE_NAMES)]:
        entries = json.loads(run(["gh", kind, "list", "--repo", config["repository"], "--json", "name"]))
        missing = expected - {entry["name"] for entry in entries}
        if missing:
            raise RuntimeError(f"Missing GitHub {kind}s: {', '.join(sorted(missing))}")
    variables = json.loads(run(["gh", "variable", "list", "--repo", config["repository"], "--json", "name,value"]))
    values = {entry["name"]: entry["value"] for entry in variables}
    for name, value in config["variables"].items():
        if values.get(name) != value:
            raise RuntimeError(f"GitHub variable {name} differs from the validated configuration")
    print(f"Ready: {config['repository']}; Keychain profile {config['profile']}; all GitHub settings present.")


def package(args):
    config = read_config()
    app = ROOT / "target/release/bundle/Splash.app"
    version = run(["plutil", "-extract", "CFBundleShortVersionString", "raw", "-o", "-", str(app / "Contents/Info.plist")]).decode().strip()
    arch = run(["lipo", "-archs", str(app / "Contents/MacOS/splash")]).decode().strip().replace(" ", "-")
    archive = args.output or ROOT / f"target/distrib/Splash-{version}-macos-{arch}-{time.strftime('%Y%m%d-%H%M%S')}.zip"
    env = dict(os.environ, APPLE_APPLICATION_SIGNING_IDENTITY=config["identity"], APPLE_NOTARY_PROFILE=config["profile"])
    subprocess.run([str(ROOT / "scripts/package-release.sh"), str(app), str(archive.resolve())], env=env, cwd=ROOT, check=True)
    print(f"Verified release: {archive}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--version", action="version", version="%(prog)s 1")
    commands = parser.add_subparsers(dest="command", required=True)
    setup_parser = commands.add_parser("setup", help="Validate shared assets; optionally configure GitHub and Keychain")
    setup_parser.add_argument("--application-p12", type=Path, required=True)
    setup_parser.add_argument("--password-file", type=Path, required=True)
    setup_parser.add_argument("--installer-p12", type=Path, required=True, help="Developer ID Installer export, for the .pkg")
    setup_parser.add_argument("--installer-password-file", type=Path, help="Defaults to --password-file")
    setup_parser.add_argument("--notary-key", type=Path, required=True)
    issuer = setup_parser.add_mutually_exclusive_group(required=True)
    issuer.add_argument("--issuer-file", type=Path)
    issuer.add_argument("--issuer-id", help="App Store Connect issuer UUID (not a secret)")
    setup_parser.add_argument("--key-id", help="Defaults to the ID in AuthKey_KEYID.p8")
    setup_parser.add_argument("--repo", help="Defaults to this checkout's GitHub repository")
    setup_parser.add_argument("--profile", default="splash-notary", help="Keychain profile to create/update (default: splash-notary)")
    setup_parser.add_argument("--apply", action="store_true", help="Write GitHub settings and local Keychain credentials after validation")
    setup_parser.set_defaults(func=setup)
    status_parser = commands.add_parser("status", help="Check Apple authentication and GitHub setting names")
    status_parser.set_defaults(func=status)
    package_parser = commands.add_parser("package", help="Sign and notarize the existing rata bundle; no GitHub publication")
    package_parser.add_argument("--output", type=Path, help="New ZIP path; defaults to a timestamped path under target/distrib")
    package_parser.set_defaults(func=package)
    args = parser.parse_args()
    try:
        args.func(args)
    except (OSError, ValueError, RuntimeError, subprocess.CalledProcessError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("Interrupted.", file=sys.stderr)
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())
