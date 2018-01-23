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
    domain_name = "${aws_s3_bucket.uscis_frontend.website_endpoint}"
    origin_id   = "uscis-frontend-origin"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "http-only"
      origin_read_timeout      = 30
      origin_ssl_protocols     = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
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

  restrictions {
    geo_restriction {
      locations        = ["US"]
      restriction_type = "whitelist"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "${var.ssl_cert_id}"
    ssl_support_method  = "sni-only"
  }
}
