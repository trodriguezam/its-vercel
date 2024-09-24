class CreateUserQuestions < ActiveRecord::Migration[7.2]
  def change
    create_table :user_questions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.boolean :correct
      t.integer :try, default: 0

      t.timestamps
    end
  end
end
