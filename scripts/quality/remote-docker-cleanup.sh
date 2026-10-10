#!/usr/bin/env bash
# Destroy only the resources in the dedicated audit ledger. This never lists or
# selects arbitrary EC2 instances. It is intentionally inert without --execute.
set -euo pipefail

[[ ${1:-} == --execute ]] || {
  echo "Dry run. Re-run with --execute only after the audit owner says the remote runner is no longer needed."
  exit 0
}

profile=${AWS_PROFILE:-lisethsolutions}
region=${AWS_REGION:-eu-north-1}
resources=${SPLASH_QUALITY_RESOURCES:-/tmp/splash-quality-remote-docker-resources.json}
[[ -f "$resources" ]] || { echo "Missing resource ledger: $resources" >&2; exit 1; }

read_field() { node -p "require(process.argv[1])[process.argv[2]] || ''" "$resources" "$1"; }
instance_id=$(read_field instance_id)
vpc_id=$(read_field vpc_id)
subnet_id=$(read_field subnet_id)
route_table_id=$(read_field route_table_id)
igw_id=$(read_field internet_gateway_id)
sg_id=$(read_field security_group_id)
role_name=$(read_field iam_role_name)
profile_name=$(read_field instance_profile_name)
bucket=$(read_field s3_bucket)
root_volume_id=$(read_field root_volume_id)
ledger_name=$(read_field name)
ledger_profile=$(read_field profile)
ledger_region=$(read_field region)
expected_instance_id=${SPLASH_QUALITY_EXPECTED_INSTANCE_ID:-}
expected_account_id=${SPLASH_QUALITY_EXPECTED_ACCOUNT_ID:-}

for value in "$instance_id" "$vpc_id" "$subnet_id" "$route_table_id" "$igw_id" "$sg_id" "$role_name" "$profile_name" "$bucket" "$root_volume_id" "$ledger_name" "$ledger_profile" "$ledger_region" "$expected_instance_id" "$expected_account_id"; do
  [[ -n "$value" ]] || { echo "Ledger is incomplete; refusing cleanup." >&2; exit 1; }
done
[[ "$expected_instance_id" == "$instance_id" ]] || { echo "SPLASH_QUALITY_EXPECTED_INSTANCE_ID does not match the ledger; refusing cleanup." >&2; exit 1; }
[[ "$profile" == "$ledger_profile" ]] || { echo "AWS_PROFILE does not match the ledger; refusing cleanup." >&2; exit 1; }
[[ "$region" == "$ledger_region" ]] || { echo "AWS_REGION does not match the ledger; refusing cleanup." >&2; exit 1; }

account_id=$(aws sts get-caller-identity --profile "$profile" --query Account --output text)
[[ "$account_id" == "$expected_account_id" ]] || { echo "SPLASH_QUALITY_EXPECTED_ACCOUNT_ID does not match the active AWS account; refusing cleanup." >&2; exit 1; }

# Verify the exact instance is one created for this audit before terminating it.
# shellcheck disable=SC2016 # The JMESPath filter needs literal backticks.
instance=$(aws ec2 describe-instances --profile "$profile" --region "$region" --instance-ids "$instance_id" \
  --query 'Reservations[0].Instances[0].{VpcId:VpcId,Tags:Tags,RootVolumeId:BlockDeviceMappings[?DeviceName==`/dev/sda1`].Ebs.VolumeId | [0]}' --output json)
node -e 'const instance=JSON.parse(process.argv[1]); const values=Object.fromEntries(instance.Tags.map(t=>[t.Key,t.Value])); if(values.Purpose !== "SplashQualityAudit" || values.ManagedBy !== "Codex" || values.Name !== process.argv[2] + "-runner" || instance.VpcId !== process.argv[3] || instance.RootVolumeId !== process.argv[4]) process.exit(1)' "$instance" "$ledger_name" "$vpc_id" "$root_volume_id" \
  || { echo "Refusing: instance is not tagged as this audit runner." >&2; exit 1; }

# Do not infer ownership from the VPC alone. A provisioning retry can leave a
# second runner (or a managed/unattached interface) in the same VPC. Listing
# these interfaces is read-only and restricted to the ledger VPC; no instance
# IDs are discovered here and then acted on.
interfaces=$(aws ec2 describe-network-interfaces --profile "$profile" --region "$region" \
  --filters "Name=vpc-id,Values=$vpc_id" \
  --query 'NetworkInterfaces[].{NetworkInterfaceId:NetworkInterfaceId,InstanceId:Attachment.InstanceId,RequesterManaged:RequesterManaged}' --output json)
node -e 'const interfaces=JSON.parse(process.argv[1]); const expected=process.argv[2]; if(!Array.isArray(interfaces) || interfaces.length===0 || interfaces.some(i => i.RequesterManaged || i.InstanceId !== expected)) process.exit(1)' "$interfaces" "$expected_instance_id" \
  || { echo "Refusing: ledger VPC has an interface that is not exclusively attached to the audit runner." >&2; exit 1; }

# Validate every ledger network object belongs to the same VPC and that the
# route table is the one actually associated with the ledger subnet. These are
# all read-only checks, performed before the first destructive operation.
subnet=$(aws ec2 describe-subnets --profile "$profile" --region "$region" --subnet-ids "$subnet_id" \
  --query 'Subnets[0].{SubnetId:SubnetId,VpcId:VpcId}' --output json)
node -e 'const subnet=JSON.parse(process.argv[1]); if(subnet.SubnetId !== process.argv[2] || subnet.VpcId !== process.argv[3]) process.exit(1)' "$subnet" "$subnet_id" "$vpc_id" \
  || { echo "Refusing: ledger subnet is not in the audit VPC." >&2; exit 1; }

security_group=$(aws ec2 describe-security-groups --profile "$profile" --region "$region" --group-ids "$sg_id" \
  --query 'SecurityGroups[0].{GroupId:GroupId,VpcId:VpcId}' --output json)
node -e 'const group=JSON.parse(process.argv[1]); if(group.GroupId !== process.argv[2] || group.VpcId !== process.argv[3]) process.exit(1)' "$security_group" "$sg_id" "$vpc_id" \
  || { echo "Refusing: ledger security group is not in the audit VPC." >&2; exit 1; }

route_table=$(aws ec2 describe-route-tables --profile "$profile" --region "$region" --route-table-ids "$route_table_id" --output json)
association_id=$(node -e 'const table=JSON.parse(process.argv[1]).RouteTables?.[0]; const subnet=process.argv[2], route=process.argv[3], vpc=process.argv[4]; const association=table?.Associations?.find(a => a.SubnetId === subnet && a.Main === false && a.RouteTableAssociationId); if(!table || table.RouteTableId !== route || table.VpcId !== vpc || !association) process.exit(1); process.stdout.write(association.RouteTableAssociationId)' "$route_table" "$subnet_id" "$route_table_id" "$vpc_id") \
  || { echo "Refusing: ledger route table is not the audit subnet's route table." >&2; exit 1; }

gateway=$(aws ec2 describe-internet-gateways --profile "$profile" --region "$region" --internet-gateway-ids "$igw_id" --output json)
node -e 'const gateway=JSON.parse(process.argv[1]).InternetGateways?.[0]; if(!gateway || gateway.InternetGatewayId !== process.argv[2] || !gateway.Attachments?.some(a => a.VpcId === process.argv[3])) process.exit(1)' "$gateway" "$igw_id" "$vpc_id" \
  || { echo "Refusing: ledger internet gateway is not attached to the audit VPC." >&2; exit 1; }

echo "Terminating only audit instance $instance_id"
aws ec2 terminate-instances --profile "$profile" --region "$region" --instance-ids "$instance_id" >/dev/null
aws ec2 wait instance-terminated --profile "$profile" --region "$region" --instance-ids "$instance_id"
for attempt in $(seq 1 30); do
  set +e
  volume_result=$(aws ec2 describe-volumes --profile "$profile" --region "$region" --volume-ids "$root_volume_id" 2>&1)
  volume_status=$?
  set -e
  if [[ "$volume_status" == 0 ]]; then
    if [[ "$attempt" == 30 ]]; then
      echo "Audit root volume $root_volume_id still exists after termination; refusing to continue cleanup." >&2
      exit 1
    fi
    sleep 2
    continue
  fi
  if [[ "$volume_result" == *"InvalidVolume.NotFound"* ]]; then
    break
  fi
  echo "Could not verify deletion of audit root volume $root_volume_id; refusing cleanup." >&2
  printf '%s\n' "$volume_result" >&2
  exit 1
done

echo "Deleting only audit source bucket $bucket"
aws s3 rm "s3://$bucket" --recursive --profile "$profile" --region "$region" --only-show-errors
aws s3api delete-bucket --profile "$profile" --region "$region" --bucket "$bucket"

aws ec2 disassociate-route-table --profile "$profile" --region "$region" --association-id "$association_id" >/dev/null
aws ec2 delete-route-table --profile "$profile" --region "$region" --route-table-id "$route_table_id"
aws ec2 delete-subnet --profile "$profile" --region "$region" --subnet-id "$subnet_id"
aws ec2 detach-internet-gateway --profile "$profile" --region "$region" --internet-gateway-id "$igw_id" --vpc-id "$vpc_id"
aws ec2 delete-internet-gateway --profile "$profile" --region "$region" --internet-gateway-id "$igw_id"
aws ec2 delete-security-group --profile "$profile" --region "$region" --group-id "$sg_id"
aws ec2 delete-vpc --profile "$profile" --region "$region" --vpc-id "$vpc_id"

aws iam remove-role-from-instance-profile --profile "$profile" --instance-profile-name "$profile_name" --role-name "$role_name"
aws iam delete-instance-profile --profile "$profile" --instance-profile-name "$profile_name"
aws iam detach-role-policy --profile "$profile" --role-name "$role_name" --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
aws iam delete-role --profile "$profile" --role-name "$role_name"

echo "Cleaned only the resources listed in $resources"
