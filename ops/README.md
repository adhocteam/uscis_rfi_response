# Terraform configs

See `ops/terraform/README.md`

# Jenkins

## Terraform

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

## Ansible playbook

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

# Build and deploy scripts

Build docker image for backend app:

```
cd ops
./build.sh <env> <version>
```

This produces the image: `uscis-backend:<env>-<version>`

If no <version> is supplied, the current git commit is used.

To push to the Elastic Container Registry:

```
cd ops
./push.sh <env> <version>
```

Convenience for running `./build.sh` and `./push.sh`:

```
cd ops
./release.sh <env> <version>
```

Convenience for deploying a new image to ECS:

```
cd ops
./deployer <env> <version>
```

The only possible value for <env> is `dev` at the moment.
