variable "env" {
  description = "The deployment environment (e.g., dev, test, prod)"
}

variable "vpc_id" {
  description = "The ID of the VPC where the app will be deployed"
}

variable "dmz_subnet_ids" {
  description = "Subnets where publicly accessible resources will be located"
  type        = "list"
}

variable "app_subnet_ids" {
  description = "Subnets where application servers will be located"
  type        = "list"
}

variable "ecr_img_url" {
  description = "URL of Elastic Container Registry for the app"
}

variable "container_name" {
  description = "Name for running app containers, identifier used to tag all resources"
}

variable "key_name" {
  description = "Name of AWS key pair"
}

variable "admin_cidr_ingress" {
  description = "CIDR to allow tcp/22 ingress to EC2 instance"
}

variable "container_port" {
  default = "3000"
}

variable "host_port" {
  default = "8080"
}

variable "service_version" {
  default = "latest"
}

variable "instance_type" {
  default     = "t2.small"
  description = "AWS instance type"
}

variable "asg_min" {
  description = "Min numbers of servers in ASG"
  default     = "1"
}

variable "asg_max" {
  description = "Max numbers of servers in ASG"
  default     = "2"
}

variable "asg_desired" {
  description = "Desired numbers of servers in ASG"
  default     = "1"
}

variable "task_count" {
  description = "Desired number ECS tasks to run"
  default     = 2
}

variable "ssl_cert_id" {
  description = "ACM cert arn to use with the Jenkins ELB"
  default     = "arn:aws:acm:us-east-1:968246069280:certificate/8c7c4d6b-5009-42d8-afe5-4c913d23a7f9"
}

variable "ami_id" {
  description = "The AWS Linux (EBS-optimized) AMI to use"
  default     = "ami-28456852"
}
