class AddPrerequisiteToTopic < ActiveRecord::Migration[7.2]
  def change
    add_reference :topics, :prerequisite, foreign_key: { to_table: :topics }
  end
end
