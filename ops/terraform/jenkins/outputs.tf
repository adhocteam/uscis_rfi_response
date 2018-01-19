output "public_ip" {
  value = "${aws_instance.jenkins.public_ip}"
}

output "public_ip" {
  value = "${aws_elb.elb.dns_name}"
}
