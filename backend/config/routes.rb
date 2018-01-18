# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount_devise_token_auth_for 'User', at: 'auth'
  post 'api/presigned_url'
  resources :submissions, only: [:index, :show, :create, :update]
  get 'api/auth_required'
end
