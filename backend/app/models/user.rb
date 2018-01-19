class User < ApplicationRecord
  has_many :submissions
  enum role: [ :admin, :user ]
end
