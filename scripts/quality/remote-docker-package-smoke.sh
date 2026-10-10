#!/usr/bin/env bash
# Smoke published Linux packages on the dedicated x64 audit runner. The input
# must be a synthetic/public CI artifact directory; it is uploaded only to the
# dedicated private audit bucket and is not committed to the repository.
set -euo pipefail

packages_dir=${1:?usage: remote-docker-package-smoke.sh /path/to/packages [label]}
label=${2:-packages}
[[ -d "$packages_dir" ]] || { echo "Not a directory: $packages_dir" >&2; exit 1; }
[[ "$label" =~ ^[a-zA-Z0-9._-]+$ ]] || { echo "Label may only contain letters, digits, dot, underscore, and hyphen." >&2; exit 1; }

profile=${AWS_PROFILE:-lisethsolutions}
region=${AWS_REGION:-eu-north-1}
resources=${SPLASH_QUALITY_RESOURCES:-/tmp/splash-quality-remote-docker-resources.json}
[[ -f "$resources" ]] || { echo "Missing resource ledger: $resources" >&2; exit 1; }
instance_id=$(node -p "require(process.argv[1]).instance_id" "$resources")
bucket=$(node -p "require(process.argv[1]).s3_bucket || ''" "$resources")
[[ -n "$bucket" ]] || { echo "The resource ledger has no dedicated S3 bucket." >&2; exit 1; }

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
archive="packages-${label}-$(date -u +%Y%m%dT%H%M%SZ).tar.gz"
# GitHub Actions delivers artifacts as ZIP files, which do not preserve the
# executable bit of the AppImage. The release payload's AppRun permissions are
# still asserted inside packaging/smoke-linux.sh; this restores only the
# transport-lost outer launch bit before that ordinary-user smoke test.
appimages=("$packages_dir"/*.AppImage)
[[ -f "${appimages[0]}" && ${#appimages[@]} -eq 1 ]] || {
  echo "Expected exactly one AppImage in $packages_dir." >&2
  exit 1
}
chmod 0755 "${appimages[0]}"
# Archive package files rather than `.`. A tar entry for `.` carries the local
# directory's UID/mode and would overwrite the prepared remote staging
# directory, making the UID 1001 execution check unable to traverse it.
(cd "$packages_dir" && COPYFILE_DISABLE=1 tar --no-xattrs -czf "$tmpdir/$archive" -- ./*)
aws s3 cp "$tmpdir/$archive" "s3://$bucket/packages/$archive" \
  --profile "$profile" --region "$region" --sse AES256 --only-show-errors
url=$(aws s3 presign "s3://$bucket/packages/$archive" --expires-in 21600 --profile "$profile" --region "$region")

node - "$url" "$label" >"$tmpdir/command.json" <<'NODE'
const [url, label] = process.argv.slice(2);
const quote = value => `'${value.replace(/'/g, `'"'"'`)}'`;
const shell = [
  'set -euo pipefail',
  'exec 9>/opt/splash-quality/quality.lock',
  'flock -n 9 || { echo "A quality run is already using this runner." >&2; exit 75; }',
  'cd /opt/splash-quality/workspace',
  // The package is executed as UID 1001 in the container; retain traversal
  // permissions even if a previous local tar transfer created this directory.
  'install -d -m 0755 -o ubuntu -g ubuntu /opt/splash-quality/packages /opt/splash-quality/artifacts',
  'chown ubuntu:ubuntu /opt/splash-quality/packages /opt/splash-quality/artifacts',
  'chmod 0755 /opt/splash-quality/packages /opt/splash-quality/artifacts',
  'rm -rf /opt/splash-quality/packages/*',
  `curl --fail --location --silent --show-error ${quote(url)} -o /tmp/splash-packages.tar.gz`,
  'tar -xzf /tmp/splash-packages.tar.gz -C /opt/splash-quality/packages',
  'rm -f /tmp/splash-packages.tar.gz',
  `log=/opt/splash-quality/artifacts/${label}-smoke-$(date -u +%Y%m%dT%H%M%SZ).log`,
  'runuser -u ubuntu -- docker build --platform linux/amd64 -f packaging/linux-smoke.Dockerfile -t splash-quality-linux-smoke:ubuntu-24.04 .',
  'runuser -u ubuntu -- docker run --rm --platform linux/amd64 --security-opt apparmor=unconfined --security-opt seccomp=unconfined -v /opt/splash-quality/packages:/packages:ro splash-quality-linux-smoke:ubuntu-24.04 2>&1 | tee "$log"',
];
process.stdout.write(JSON.stringify({commands: [`exec /bin/bash -s <<'SPLASH_QUALITY'\n${shell.join('\n')}\nSPLASH_QUALITY`]}));
NODE

command_id=$(aws ssm send-command --profile "$profile" --region "$region" \
  --document-name AWS-RunShellScript --instance-ids "$instance_id" \
  --timeout-seconds 3600 --comment "Splash Quality Audit $label Linux package smoke" \
  --parameters "file://$tmpdir/command.json" --query 'Command.CommandId' --output text)
echo "Started package smoke: $command_id"
echo "Read status: aws ssm get-command-invocation --profile $profile --region $region --command-id $command_id --instance-id $instance_id"
