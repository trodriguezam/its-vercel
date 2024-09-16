class User < ApplicationRecord

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum role: { user: 'user', professor: 'professor' }

  validates :role, presence: true
end