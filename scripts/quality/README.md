# Isolated Linux quality runner

These helpers run the full quality gate and finished-package smoke checks in
Ubuntu 24.04 x64 Docker on a dedicated EC2 runner. They use one exact instance
from a local resource ledger. They do not discover, select, or modify other
instances.

The runner must already exist for the audit, be reachable through AWS Systems
Manager, and have Docker installed with the `ubuntu` user in its Docker group.
The helpers use a dedicated private S3 bucket to transfer public source and
synthetic test artifacts. Keep credentials, resource ledgers, and signed URLs
outside the repository. Source upload includes tracked and non-ignored files;
inspect that file set before syncing local changes.

## Configuration

Set `AWS_PROFILE`, `AWS_REGION`, and `SPLASH_QUALITY_RESOURCES` to the audit's
profile, region, and absolute ledger path. The defaults match the October 2026
audit's local setup. Sync and package smoke require `instance_id` and
`s3_bucket` in the ledger. Cleanup additionally requires `vpc_id`, `subnet_id`,
`route_table_id`, `internet_gateway_id`, `security_group_id`, `iam_role_name`,
and `instance_profile_name`. Those resources must all belong to the same audit.
Cleanup also requires an independent exact-ID guard: set
`SPLASH_QUALITY_EXPECTED_INSTANCE_ID` to the instance ID you intend to delete;
it must exactly equal the ledger's `instance_id`. Set
`SPLASH_QUALITY_EXPECTED_ACCOUNT_ID` to the expected AWS account. Before mutation,
the script requires its effective profile and region to match the ledger, confirms
the active STS account, and verifies the exact instance Name, Purpose, ManagedBy,
VPC, and root-volume mapping. It accepts root-volume deletion only when AWS reports
`InvalidVolume.NotFound`.

Local dependencies are AWS CLI, Node.js, Git, Bash, and tar. Run from the
worktree. The source snapshot excludes ignored files and build output. The
runner image installs Chromium's OS dependencies using the project's locked
Playwright version, then runs tests as UID 1000 with separate build caches.

## Run and inspect

```sh
scripts/quality/remote-docker-sync.sh
# Wait for the printed SSM sync command to complete before starting the gate.
scripts/quality/remote-docker-run.sh final
scripts/quality/remote-docker-package-smoke.sh /absolute/path/to/ci-packages final
```

Each helper prints its SSM command ID and an inspection command targeting the
ledger's exact instance. A remote lock prevents concurrent sync, gate, and
package operations. Complete logs stay under `/opt/splash-quality/artifacts/`.
The gate builds both desktop and headless configurations, runs Rust and browser
tests, exercises the authenticated server, and verifies native webview readiness.

Docker's outer AppArmor and seccomp profiles allow the namespaces required by
WebKit. WebKit's own sandbox remains enabled. Package smoke installs the finished
DEB through apt before testing it, and runs all application checks as a fresh
ordinary user with isolated temporary data. GitHub Actions downloads package
artifacts as ZIP files, which lose an AppImage's outer executable bit; the
package helper restores that one transport-lost bit before upload. The smoke
image still verifies the final AppImage's internal launcher permissions and
executes it as an ordinary user.

## Cleanup

`remote-docker-cleanup.sh` is inert without `--execute`. Before cleanup, verify
that the ledger contains only resources created for this audit and preserve the
needed logs and screenshots. Cleanup checks the exact instance's audit tags,
terminates that instance, then deletes the recorded bucket, network, and IAM
resources. Never substitute an existing production instance or shared resource
into the audit ledger.

```sh
SPLASH_QUALITY_EXPECTED_INSTANCE_ID=i-0bb6fc0108eded5ed \
SPLASH_QUALITY_EXPECTED_ACCOUNT_ID=147654942040 \
  scripts/quality/remote-docker-cleanup.sh --execute
```
