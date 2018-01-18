# frozen_string_literal: true

# API Controller
class ApiController < ApplicationController
  def presigned_url
    begin
      signer = Aws::S3::Presigner.new
      key = "#{params['user_id']}-#{params['image_name']}"
      # XXX: figure out content type
      url = signer.presigned_url(:put_object,
                                 bucket: 'uscis-rfds',
                                 key: key,
                                 acl: 'public-read',
                                 content_type: 'image/png')
    rescue Aws::S3::Errors::ServiceError => e
      render json: { 'status': e.to_s }, status: :unauthorized && return
    end
    render json: { 'status': 'ok', 'signedUrl': url }
  end
end
