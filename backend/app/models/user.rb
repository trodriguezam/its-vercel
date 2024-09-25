class User < ApplicationRecord

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum role: { user: 'user', professor: 'professor' }

  validates :role, presence: true

  has_many :user_task_skips
  has_many :skipped_tasks, through: :user_task_skips, source: :task
end