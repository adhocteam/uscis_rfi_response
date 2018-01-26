variable "aws_region" {
  description = "The AWS region to create things in."
  default     = "us-east-1"
}

variable "ssl_cert_id" {
  description = "ACM cert arn to use with the Jenkins ELB"
}

variable "db_password" {
  description = "Password for the backend app RDS instance"
}

variable "service_version" {
  description = "Service version/docker image tag to deploy"
  default = "latest"
}
