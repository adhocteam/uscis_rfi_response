variable "ssl_cert_id" {
  description = "ACM cert arn to use with the Jenkins ELB"
}

variable "kms_key_id" {
  description = "The KMS key used to encrypt/decrypt configuration variables and tf state"
}
