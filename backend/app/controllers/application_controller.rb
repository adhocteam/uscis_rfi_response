class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end
end
