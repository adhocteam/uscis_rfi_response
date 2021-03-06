variable "vpc_name" {
  description = "Name/identifier for the VPC"
}

variable "az_count" {
  description = "Number of AZs to cover in a given AWS region"
  default     = "2"
}

variable "with_app" {
  default = false
}

variable "with_data" {
  default = false
}
