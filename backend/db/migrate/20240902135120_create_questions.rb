class CreateQuestions < ActiveRecord::Migration[7.2]
  def change
    create_table :questions do |t|
      t.references :topic, null: false, foreign_key: true
      t.string :question_text
      t.string :hint
      t.string :type
      t.boolean :is_correct

      t.timestamps
    end
  end
end
