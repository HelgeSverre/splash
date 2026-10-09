#!/usr/bin/env bash
# Start an isolated native Linux x64 validation run on the dedicated EC2 runner.
# Run scripts/quality/remote-docker-sync.sh first. This script only targets the
# exact instance recorded in the local resource ledger.
set -euo pipefail

profile=${AWS_PROFILE:-lisethsolutions}
region=${AWS_REGION:-eu-north-1}
resources=${SPLASH_QUALITY_RESOURCES:-/tmp/splash-quality-remote-docker-resources.json}
phase=${1:-baseline}
[[ "$phase" =~ ^[a-z0-9-]+$ ]] || { echo "Phase must use lowercase letters, digits, and hyphens only." >&2; exit 1; }

[[ -f "$resources" ]] || { echo "Missing resource ledger: $resources" >&2; exit 1; }
instance_id=$(node -p "require(process.argv[1]).instance_id" "$resources")
[[ -n "$instance_id" && "$instance_id" != "undefined" ]] || { echo "Resource ledger has no instance id." >&2; exit 1; }

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
node - "$phase" >"$tmpdir/command.json" <<'NODE'
const phase = process.argv[2];
const shell = [
  'set -euo pipefail',
  'exec 9>/opt/splash-quality/quality.lock',
  'flock -n 9 || { echo "A quality run is already using this runner." >&2; exit 75; }',
  'cd /opt/splash-quality/workspace',
  'install -d -o ubuntu -g ubuntu /opt/splash-quality/artifacts /opt/splash-quality/cargo-target /opt/splash-quality/npm-cache /opt/splash-quality/playwright',
  `log=/opt/splash-quality/artifacts/${phase}-$(date -u +%Y%m%dT%H%M%SZ).log`,
  'runuser -u ubuntu -- docker build --platform linux/amd64 -f scripts/quality/Dockerfile -t splash-quality-runner:ubuntu-24.04 .',
  'for volume in splash-quality-cargo-registry splash-quality-cargo-git splash-quality-cargo-target splash-quality-npm-cache splash-quality-playwright; do docker volume create "$volume" >/dev/null; docker run --rm -v "$volume:/data" ubuntu:24.04 chown -R 1000:1000 /data; done',
  'runuser -u ubuntu -- docker run --rm --platform linux/amd64 --security-opt apparmor=unconfined --security-opt seccomp=unconfined --user 1000:1000 -v /opt/splash-quality/workspace:/workspace -v splash-quality-cargo-registry:/cargo-home/registry -v splash-quality-cargo-git:/cargo-home/git -v splash-quality-cargo-target:/cargo-target -v splash-quality-npm-cache:/npm-cache -v splash-quality-playwright:/playwright splash-quality-runner:ubuntu-24.04 bash -lc "npm ci --prefix app && npm ci --prefix e2e && npx --prefix e2e playwright install chromium && just frontend && node --experimental-strip-types --test app/tests/*.test.ts && cargo check --locked --all-targets && cargo check --locked --no-default-features --all-targets && just check && SPLASH_E2E_BIN_DIR=/cargo-target/debug just e2e --workers=2 && cargo build --locked --bin splash && cargo build --locked --no-default-features --bin splash-server && python3 scripts/test-server-http.py /cargo-target/debug/splash-server && xvfb-run -a dbus-run-session -- python3 scripts/test-desktop.py /cargo-target/debug/splash" 2>&1 | tee "$log"',
];
process.stdout.write(JSON.stringify({commands: [`exec /bin/bash -s <<'SPLASH_QUALITY'\n${shell.join('\n')}\nSPLASH_QUALITY`]}));
NODE

command_id=$(aws ssm send-command --profile "$profile" --region "$region" \
  --document-name AWS-RunShellScript --instance-ids "$instance_id" \
  --timeout-seconds 3600 --comment "Splash Quality Audit $phase native Linux validation" \
  --parameters "file://$tmpdir/command.json" --query 'Command.CommandId' --output text)

echo "Started $phase validation: $command_id"
echo "Read status: aws ssm get-command-invocation --profile $profile --region $region --command-id $command_id --instance-id $instance_id"
