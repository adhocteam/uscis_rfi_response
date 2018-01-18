# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApiController, type: :request do
  describe 'post #presigned_url' do
    before do
    end

    it 'returns http success' do
      headers = { 'CONTENT_TYPE' => 'application/json' }
      # to generate the image, I found a tiny png world map, and did:
      # base64 < world_tiny.png
      post '/api/presigned_url', params: <<~POST, headers: headers
        {
          "user_id": "e3ca6d96454e4a508a677e9e6c3dc3e3",
          "image_name": "my cat.jpg",
          "image_type": "image/png"
        }
      POST
      expect(response).to have_http_status(:success)
      url = 'https://uscis-rfds.s3.us-stubbed-1.amazonaws.com/e3ca6d96454e4a508a677e9e6c3dc3e3-my%20cat.jpg'
      body = JSON.parse(response.body)
      expect(body['status']).to eq 'ok'
      expect(body['signedUrl']).to match url
    end
  end
end
