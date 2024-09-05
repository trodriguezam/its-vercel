class ChangeQuestionAssociations < ActiveRecord::Migration[7.2]
  def change
    remove_reference :questions, :topic, foreign_key: true
    add_reference :questions, :task, foreign_key: true
  end
end
