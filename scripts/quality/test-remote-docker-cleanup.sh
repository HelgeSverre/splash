#!/usr/bin/env bash
# Exercises cleanup's AWS preflight without an AWS account. The mock records
# every request so the sibling-ENI case proves no destructive call is reached.
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
cleanup="$root/scripts/quality/remote-docker-cleanup.sh"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

cat >"$tmp/resources.json" <<'JSON'
{"name":"splash-quality-audit-test","profile":"lisethsolutions","region":"eu-north-1","instance_id":"i-audit","vpc_id":"vpc-audit","subnet_id":"subnet-audit","route_table_id":"rtb-audit","internet_gateway_id":"igw-audit","security_group_id":"sg-audit","iam_role_name":"audit-role","instance_profile_name":"audit-profile","s3_bucket":"audit-bucket","root_volume_id":"vol-audit"}
JSON

mkdir "$tmp/bin"
cat >"$tmp/bin/aws" <<'AWS'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >>"$MOCK_AWS_LOG"
args=" $* "
case "$args" in
  *" sts get-caller-identity "*) printf '123456789012\n' ;;
  *" ec2 describe-instances "*) cat <<'JSON'
{"VpcId":"vpc-audit","RootVolumeId":"vol-audit","Tags":[{"Key":"Purpose","Value":"SplashQualityAudit"},{"Key":"ManagedBy","Value":"Codex"},{"Key":"Name","Value":"splash-quality-audit-test-runner"}]}
JSON
    ;;
  *" ec2 describe-network-interfaces "*)
    case ${MOCK_ENI_KIND:-eligible} in
      eligible) printf '[{"NetworkInterfaceId":"eni-audit","InstanceId":"i-audit","RequesterManaged":false}]\n' ;;
      sibling) printf '[{"NetworkInterfaceId":"eni-audit","InstanceId":"i-audit","RequesterManaged":false},{"NetworkInterfaceId":"eni-sibling","InstanceId":"i-sibling","RequesterManaged":false}]\n' ;;
      requester-managed) printf '[{"NetworkInterfaceId":"eni-managed","InstanceId":null,"RequesterManaged":true}]\n' ;;
      unattached) printf '[{"NetworkInterfaceId":"eni-unattached","InstanceId":null,"RequesterManaged":false}]\n' ;;
      *) printf 'unknown mock ENI kind\n' >&2; exit 64 ;;
    esac
    ;;
  *" ec2 describe-subnets "*) printf '{"SubnetId":"subnet-audit","VpcId":"%s"}\n' "${MOCK_SUBNET_VPC:-vpc-audit}" ;;
  *" ec2 describe-security-groups "*) printf '{"GroupId":"sg-audit","VpcId":"vpc-audit"}\n' ;;
  *" ec2 describe-route-tables "*) printf '{"RouteTables":[{"RouteTableId":"rtb-audit","VpcId":"vpc-audit","Associations":[{"SubnetId":"subnet-audit","Main":false,"RouteTableAssociationId":"rtbassoc-audit"}]}]}\n' ;;
  *" ec2 describe-internet-gateways "*) printf '{"InternetGateways":[{"InternetGatewayId":"igw-audit","Attachments":[{"VpcId":"vpc-audit"}]}]}\n' ;;
  *" ec2 terminate-instances "*|*" ec2 wait instance-terminated "*|*" s3 rm "*|*" s3api delete-bucket "*|*" ec2 disassociate-route-table "*|*" ec2 delete-route-table "*|*" ec2 delete-subnet "*|*" ec2 detach-internet-gateway "*|*" ec2 delete-internet-gateway "*|*" ec2 delete-security-group "*|*" ec2 delete-vpc "*|*" iam remove-role-from-instance-profile "*|*" iam delete-instance-profile "*|*" iam detach-role-policy "*|*" iam delete-role "*) ;;
  *" ec2 describe-volumes "*) printf 'An error occurred (InvalidVolume.NotFound)\n' >&2; exit 255 ;;
  *) printf 'unexpected mock AWS command: %s\n' "$*" >&2; exit 64 ;;
esac
AWS
cat >"$tmp/bin/sleep" <<'SLEEP'
#!/usr/bin/env bash
exit 0
SLEEP
chmod +x "$tmp/bin/aws" "$tmp/bin/sleep"

run() {
  local log="$1"
  shift
  PATH="$tmp/bin:$PATH" AWS_PROFILE=lisethsolutions AWS_REGION=eu-north-1 MOCK_AWS_LOG="$log" \
    SPLASH_QUALITY_RESOURCES="$tmp/resources.json" \
    SPLASH_QUALITY_EXPECTED_INSTANCE_ID=i-audit \
    SPLASH_QUALITY_EXPECTED_ACCOUNT_ID=123456789012 \
    "$@" "$cleanup" --execute
}

assert_only_read_calls() {
  local log="$1"
  [[ -e "$log" ]] || return 0
  local call
  while IFS= read -r call; do
    case " $call " in
      *" sts get-caller-identity "*|*" ec2 describe-instances "*|*" ec2 describe-network-interfaces "*|*" ec2 describe-subnets "*|*" ec2 describe-security-groups "*|*" ec2 describe-route-tables "*|*" ec2 describe-internet-gateways "*) ;;
      *) echo "unexpected non-read AWS command in refusal case: $call" >&2; return 1 ;;
    esac
  done <"$log"
}

wrong_id_log="$tmp/wrong-id.log"
if run "$wrong_id_log" env SPLASH_QUALITY_EXPECTED_INSTANCE_ID=i-not-audit; then
  echo "mismatched expected instance ID was accepted" >&2
  exit 1
fi
[[ ! -e "$wrong_id_log" ]]

wrong_account_log="$tmp/wrong-account.log"
if run "$wrong_account_log" env SPLASH_QUALITY_EXPECTED_ACCOUNT_ID=000000000000; then
  echo "mismatched expected AWS account was accepted" >&2
  exit 1
fi
grep -Fq 'sts get-caller-identity' "$wrong_account_log"
assert_only_read_calls "$wrong_account_log"

for eni_kind in sibling requester-managed unattached; do
  eni_log="$tmp/$eni_kind.log"
  if run "$eni_log" env MOCK_ENI_KIND="$eni_kind"; then
    echo "$eni_kind ENI was accepted" >&2
    exit 1
  fi
  grep -Fq 'ec2 describe-network-interfaces' "$eni_log"
  assert_only_read_calls "$eni_log"
done

wrong_subnet_log="$tmp/wrong-subnet.log"
if run "$wrong_subnet_log" env MOCK_SUBNET_VPC=vpc-not-audit; then
  echo "subnet outside the audit VPC was accepted" >&2
  exit 1
fi
grep -Fq 'ec2 describe-subnets' "$wrong_subnet_log"
assert_only_read_calls "$wrong_subnet_log"

success_log="$tmp/success.log"
run "$success_log" env
grep -Eq 'ec2 terminate-instances .*--instance-ids i-audit' "$success_log"
grep -Fq 's3 rm' "$success_log"
grep -Fq 'ec2 delete-vpc' "$success_log"

echo "remote Docker cleanup mock regression passed"
