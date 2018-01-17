class Submission < ApplicationRecord
  enum status: [ :requested, :submitted, :approved, :rejected ]
end
