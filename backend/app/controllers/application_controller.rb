class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  def index
    render json: { "status" => "ok" }
  end
end
