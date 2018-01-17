output "registry_name" {
  value = "${aws_ecr_repository.main.name}"
}

output "registry_id" {
  value = "${aws_ecr_repository.main.registry_id}"
}

output "respository_url" {
  value = "${aws_ecr_repository.main.repository_url}"
}
