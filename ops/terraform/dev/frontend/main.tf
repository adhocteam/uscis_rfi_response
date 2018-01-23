provider "aws" {
  region = "us-east-1"
}

variable "bucket_name" {
  default = "uscis-rfds.adhocteam.us"
}

data "template_file" "uscis_frontend_bucket_policy" {
  template = "${file("${path.module}/templates/frontend.json")}"

  vars {
    bucket_name = "${var.bucket_name}"
  }
}

resource "aws_s3_bucket" "uscis_frontend" {
  bucket = "${var.bucket_name}"
  acl    = "public-read"
  policy = "${data.template_file.uscis_frontend_bucket_policy.rendered}"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags {
    Name = "${var.bucket_name}"
  }
}
