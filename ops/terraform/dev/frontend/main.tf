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

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.uscis_frontend.bucket_domain_name}"
    origin_id   = "uscis-frontend-origin"
  }

  enabled             = true
  default_root_object = "index.html"

  aliases = ["uscis-rfds.adhocteam.us"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "uscis-frontend-origin"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 60
    max_ttl                = 60
  }

  price_class = "PriceClass_100"

  tags {
    Name = "${var.bucket_name}"
  }

  acm_certificate_arn = "${var.ssl_cert_id}"
}
