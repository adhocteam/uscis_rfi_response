# frozen_string_literal: true

# https://www.valentinog.com/blog/devise-token-auth-rails-api/
Devise.setup do |config|
  config.navigational_formats = [:json]
end
