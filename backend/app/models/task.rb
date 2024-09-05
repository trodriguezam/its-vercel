class Task < ApplicationRecord
  belongs_to :topic
  has_many :questions, dependent: :destroy
end
