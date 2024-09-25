class Task < ApplicationRecord
  belongs_to :topic
  has_many :questions, dependent: :destroy
  has_many :user_task_skips
  has_many :skipping_users, through: :user_task_skips, source: :user
end
