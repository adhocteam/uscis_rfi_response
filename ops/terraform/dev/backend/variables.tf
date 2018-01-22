variable "aws_region" {
  description = "The AWS region to create things in."
  default     = "us-east-1"
}

variable "db_password" {
  description = "Password for the backend app RDS instance"
}

variable "service_version" {
  description = "Service version/docker image tag to deploy"
  default = "latest"
}
