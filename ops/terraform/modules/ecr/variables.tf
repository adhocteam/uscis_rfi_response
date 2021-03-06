variable "repository_name" {
  description = "A name for the repository"
}

variable "jenkins_arn" {
  description = "ARN for jenkins instance role"
}

variable "admin_arn" {
  description = "ARN of IAM user that administers the ECR repo"
}
