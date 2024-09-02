class Topic < ApplicationRecord
    belongs_to :prerequisite, class_name: 'Topic', optional: true
    has_many :subtopics, class_name: 'Topic', foreign_key: 'prerequisite_id'
    has_many :questions
end
