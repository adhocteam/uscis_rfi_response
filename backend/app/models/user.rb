class User < ApplicationRecord
  enum role: [ :admin, :user ]
end
