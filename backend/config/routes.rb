# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount_devise_token_auth_for 'Admin', at: 'auth', skip: [:omniauth_callbacks]
  post 'submissions/presigned_url', to: 'submissions#presigned_url'
  resources :submissions, only: [:index, :show, :create, :update]
  resource :admin, only: [:show]
end
