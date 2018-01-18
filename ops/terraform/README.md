Steps to bring up infrastructure:

1. Apply the `global` configurations:

```
cd ops/terraform/global
terraform init && terraform apply
```

This creates the s3 bucket and dynamo db table used to store terraform state.

2. Apply the Elastic Container Registry configurations:

```
cd ops/terraform/<env>/ecr
terraform init && terraform apply
```

This will create an ECR to store docker images for the application.

3. Build and push the initial docker image to ECR:

```
cd ops
./release.sh
```

4. Apply the backend application configurations:

```
cd ops/terraform/<env>/backend
terraform init && terraform apply
```
