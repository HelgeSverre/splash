#!/usr/bin/env bash
# Upload a source-only, non-ignored worktree snapshot to the dedicated audit runner.
# This deliberately uses git's file list: ignored local configuration, credentials,
# node_modules, and build output cannot be included in the upload.
set -euo pipefail

root=$(git rev-parse --show-toplevel)
cd "$root"

profile=${AWS_PROFILE:-lisethsolutions}
region=${AWS_REGION:-eu-north-1}
resources=${SPLASH_QUALITY_RESOURCES:-/tmp/splash-quality-remote-docker-resources.json}

[[ -f "$resources" ]] || { echo "Missing resource ledger: $resources" >&2; exit 1; }
instance_id=$(node -p "require(process.argv[1]).instance_id" "$resources")
bucket=$(node -p "require(process.argv[1]).s3_bucket || ''" "$resources")
[[ -n "$bucket" ]] || { echo "The resource ledger has no dedicated S3 bucket." >&2; exit 1; }

snapshot="source-$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)"
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

# --cached includes tracked files, --modified includes staged and unstaged edits,
# and --others --exclude-standard adds new test files while excluding .env and
# other ignored private/development material.
git ls-files -z --cached --modified --others --exclude-standard >"$tmpdir/files"
COPYFILE_DISABLE=1 tar --no-xattrs --null --files-from="$tmpdir/files" -czf "$tmpdir/$snapshot.tar.gz"

aws s3 cp "$tmpdir/$snapshot.tar.gz" "s3://$bucket/snapshots/$snapshot.tar.gz" \
  --profile "$profile" --region "$region" --sse AES256 --only-show-errors
url=$(aws s3 presign "s3://$bucket/snapshots/$snapshot.tar.gz" \
  --expires-in 21600 --profile "$profile" --region "$region")

command_file="$tmpdir/command.json"
node - "$url" "$snapshot" >"$command_file" <<'NODE'
const [url, snapshot] = process.argv.slice(2);
const quote = value => `'${value.replace(/'/g, `'"'"'`)}'`;
const shell = [
  'set -euo pipefail',
  'exec 9>/opt/splash-quality/quality.lock',
  'flock -n 9 || { echo "A quality run is already using this runner." >&2; exit 75; }',
  'install -d -o ubuntu -g ubuntu /opt/splash-quality/workspace',
  'rm -rf /opt/splash-quality/workspace/*',
  `curl --fail --location --silent --show-error ${quote(url)} -o /tmp/splash-source.tar.gz`,
  'tar -xzf /tmp/splash-source.tar.gz -C /opt/splash-quality/workspace',
  'chown -R ubuntu:ubuntu /opt/splash-quality/workspace',
  `printf '%s\\n' ${quote(snapshot)} > /opt/splash-quality/workspace/.quality-snapshot`,
  'rm -f /tmp/splash-source.tar.gz',
];
process.stdout.write(JSON.stringify({commands: [`exec /bin/bash -s <<'SPLASH_QUALITY'\n${shell.join('\n')}\nSPLASH_QUALITY`]}));
NODE

command_id=$(aws ssm send-command --profile "$profile" --region "$region" \
  --document-name AWS-RunShellScript --instance-ids "$instance_id" \
  --comment "Splash Quality Audit source snapshot $snapshot" \
  --parameters "file://$command_file" --query 'Command.CommandId' --output text)

echo "Uploaded $snapshot; SSM command: $command_id"
echo "Inspect with: aws ssm get-command-invocation --profile $profile --region $region --command-id $command_id --instance-id $instance_id"
