resource "aws_route53_record" "domain" {
  zone_id = "Z0799139180470SO0CBEE"
  name = var.domain
  type = "A"

  alias {
    name = aws_cloudfront_distribution.cdn.domain_name
    zone_id = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

