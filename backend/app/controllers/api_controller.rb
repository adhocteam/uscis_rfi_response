# frozen_string_literal: true

# API Controller
class ApiController < ApplicationController
  before_action :authenticate_user!, except: [:presigned_url]

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

  # * token auth
  #   * Installed devise and created an admin user with:
  #     * curl -H "Content-Type: application/json" -d '{"email": "bill@billmill.org", "password": "adminadmin"}' http://localhost:3000/auth
  #       * obviously we'll have to disallow free registration! How to do so?
  #   * Sign in with:
  #     * curl -i -H "Content-Type: application/json" -d '{"email": "bill@billmill.org", "password": "adminadmin"}' http://localhost:3000/auth/sign_in
  #   * then you can call an auth-required endpoint with the values from the response header:
  #     * curl -i -H "access-token: <access_token>" -H "client: <client>" -H "expiry: <expiry>" -H "uid: <expiry>" http://localhost:3000/api/auth_required
  def auth_required
    render json: { 'status': 'ok' }
  end
end
