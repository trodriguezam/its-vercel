class CreateUserTaskSkips < ActiveRecord::Migration[7.2]
  def change
    create_table :user_task_skips do |t|
      t.references :user, null: false, foreign_key: true
      t.references :task, null: false, foreign_key: true
      t.integer :skip_count, default: 0, null: false

      t.timestamps
    end
  end
end
