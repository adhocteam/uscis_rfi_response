# frozen_string_literal: true

# API Controller
class ApiController < ApplicationController
  def presigned_url
    begin
      signer = Aws::S3::Presigner.new
      key = "#{params.fetch('user_id')}-#{params.fetch('image_name')}"
      url = signer.presigned_url(:put_object,
                                 bucket: 'uscis-rfds',
                                 key: key,
                                 acl: 'public-read',
                                 content_type: params.fetch('image_type'))
    rescue Aws::S3::Errors::ServiceError => e
      render json: { 'status': e.to_s }, status: :unauthorized && return
    end
    render json: { 'status': 'ok', 'signedUrl': url }
  end
end
