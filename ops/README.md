## Deployment infrastructure

### Steps to bring up infrastructure:

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
./backend-release.sh <env> <version:-latest>
```

4. Apply the backend application configurations:

```
cd ops/terraform/<env>/backend
terraform init && terraform apply -var 'db_password=<your-password-here>'
```

The value for `db_password` is used for the admin user (i.e., `uscis`) of the postgres database brought up for the backend app.

### Setting up the RDS database

To bootstrap the database:

1. Make sure the appropriate env vars are set for the AWS environment (see: `ops/config`).

The app expects these env vars are defined:

```
DB_USER
DB_PASS
DB_NAME
DB_HOST
DB_PORT
```

2. Build a new image for the backend app (see: [build and deploy scripts](#build-and-deploy-scripts))
3. Login to the ec2 instance where ECS containers are deployed:

```
ssh -i /path/to/key.pem ec2-user@<ip-of-ec2-instance>
```

4. Run the following command:

```
docker run --rm \
    -it --name uscis-db-setup\
    <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com/<repo-or-image-name>:<version-tag> \
    bundle exec rake db:drop db:create db:migrate`
```

Be sure to fill in the appropriate values for `<aws-account-id>`, `<aws-region>`, `<repo-or-image-name>` and `<version-tag>`.

### Build and deploy scripts

Build docker image for backend app:

```
cd ops/scripts
./backend-build.sh <env> <version>
```

This produces the image: `uscis-backend:<env>-<version>`

If no <version> is supplied, the current git commit is used.

To push to the Elastic Container Registry:

```
cd ops/scripts
./backend-push.sh <env> <version>
```

Convenience for running `./backend-build.sh` and `./backend-push.sh`:

```
cd ops/scripts
./backend-release.sh <env> <version>
```

Convenience for deploying a new image to ECS:

```
cd ops/scripts
./deploy.sh <env> <version>
```

The only possible value for <env> is `dev` at the moment.

### Rotating ECS container instances

When a new AWS Linux AMI is released, it is possible to bring new container instances into service to replace the old with zero downtime.

To do this manually:

1. Update the `image_id` attribute using the ID of the latest AWS Linux AMI (ECS-optimized)
2. Double the value for `asg_desired` attribute of the application's app module
3. Apply the changes (modifying `<version>` and `<db_password>` with the appropriate values):

```
cd ops/terraform/dev/backend
terraform apply -var service_version=<version> -var db_password=<db_password>
```

4. Wait for the autoscaling group to launch a new instances using the updated AMI ID
5. When the instances are healthy, double the value of `task_count` attribute of the applications app module
6. Apply the changes by rerunning the `terraform apply` command from step 3 above
7. When the ECS service "Desired count" matches the value for `task_count` and all tasks and instances are healthy, reverse the process: restore the original value for `task_count` and apply changes; restore the original value for `asg_desired` and apply changes. ECS will remove the old tasks and the autoscaling group will remove the old ec2 instances.

TODO: automate this process.

## Jenkins

### Terraform

The included configs will provision:

- A separate VPC for housing Jenkins-related resources
- An ec2 instance to run Jenkins
- 2 EBS volumes
    - One for Docker (storage of images and writeable layers)
    - One for persistence of Jenkins' home directory

To bring up Jenkins infrastructure:

```
cd ops/terraform/jenkins
terraform apply
```

### Ansible playbook

The included Ansible playbook:

- Installs Docker and Nginx on the ec2 instance brought up in the previous step
- Configures the EBS volumes attached to the instance
- Bakes a custom Jenkins image (based on the official [Jenkins Docker image](https://hub.docker.com/r/jenkins/jenkins/)) with our requirements
- Starts (or restarts) the Jenkins container and Nginx

To use the playbook, grab the public IP address of the ec2 instance from the previous step, run the following commands:

```
cd ops/playbooks
ansible-playbook -i "<public_ip_address>," jenkins.yml
```

### Custom Jenkins Docker Image

Extra utilities and dependencies can be added to the Jenkins image so that they may be used in Jenkins jobs.

Add new requirements to: `/ops/playbooks/files/Dockerfile`

Note that the Jenkins image we're using `jenkins:lts-alpine`. You'll need to use `apk add ...` to install new packages or add to/modify `/etc/apk/repositories` to source packages that are not available by default.

Further note that installing package requires the `root` user in the alpine image. So, make sure any additions to the Dockerfile happen in between `USER root` and the switch back to `USER jenkins`.

Example -- installing the aws cli tools:

```
RUN apk add --no-cache py-pip && \
    pip install awscli
```
