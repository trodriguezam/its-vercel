class Question < ApplicationRecord
  belongs_to :task
  has_many :answers
end
