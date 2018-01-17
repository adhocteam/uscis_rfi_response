require 'rails_helper'

RSpec.describe ApiController, type: :request do

  describe "post #upload" do
    it "returns http success" do
      headers = { 'CONTENT_TYPE' => 'application/json' }
      post "/api/upload", params: <<-POST, headers: headers
{
  "user_id": "e3ca6d96454e4a508a677e9e6c3dc3e3",
  "image_name": "my cat.jpg",
  "image_base64": "f3u4o2igowh8390t4h8w39th40389wth48390whl…",
  "timestamp": "2018-01-16T17:00:03-05:00"
}
POST
      expect(response).to have_http_status(:success)
    end
  end

end
