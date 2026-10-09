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

for value in "$instance_id" "$vpc_id" "$subnet_id" "$route_table_id" "$igw_id" "$sg_id" "$role_name" "$profile_name" "$bucket"; do
  [[ -n "$value" ]] || { echo "Ledger is incomplete; refusing cleanup." >&2; exit 1; }
done

# Verify the exact instance is one created for this audit before terminating it.
tags=$(aws ec2 describe-instances --profile "$profile" --region "$region" --instance-ids "$instance_id" \
  --query 'Reservations[0].Instances[0].Tags' --output json)
node -e 'const tags=JSON.parse(process.argv[1]); const values=Object.fromEntries(tags.map(t=>[t.Key,t.Value])); if(values.Purpose !== "SplashQualityAudit" || values.ManagedBy !== "Codex") process.exit(1)' "$tags" \
  || { echo "Refusing: instance is not tagged as this audit runner." >&2; exit 1; }

echo "Terminating only audit instance $instance_id"
aws ec2 terminate-instances --profile "$profile" --region "$region" --instance-ids "$instance_id" >/dev/null
aws ec2 wait instance-terminated --profile "$profile" --region "$region" --instance-ids "$instance_id"

echo "Deleting only audit source bucket $bucket"
aws s3 rm "s3://$bucket" --recursive --profile "$profile" --region "$region" --only-show-errors
aws s3api delete-bucket --profile "$profile" --region "$region" --bucket "$bucket"

association_id=$(aws ec2 describe-route-tables --profile "$profile" --region "$region" --route-table-ids "$route_table_id" \
  --query 'RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId | [0]' --output text)
if [[ -n "$association_id" && "$association_id" != None ]]; then
  aws ec2 disassociate-route-table --profile "$profile" --region "$region" --association-id "$association_id" >/dev/null
fi
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
