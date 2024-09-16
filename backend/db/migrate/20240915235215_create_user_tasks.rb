class CreateUserTasks < ActiveRecord::Migration[7.2]
  def change
    create_table :user_tasks do |t|
      t.integer :user_id
      t.integer :task_id
      t.float :completion

      t.timestamps
    end
  end
end
