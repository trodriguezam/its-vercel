class CreateUserTopics < ActiveRecord::Migration[7.2]
  def change
    create_table :user_topics do |t|
      t.integer :user_id
      t.integer :topic_id
      t.float :completion

      t.timestamps
    end
  end
end
