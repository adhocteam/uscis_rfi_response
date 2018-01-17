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
  default = "8080"
}

variable "host_port" {
  default = "9090"
}

variable "az_count" {
  description = "Number of AZs to cover in a given AWS region"
  default     = "2"
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
