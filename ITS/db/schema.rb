# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_09_02_172414) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "answers", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.string "answer_text"
    t.boolean "correct"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_answers_on_question_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string "question_text"
    t.boolean "is_correct"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "task_id"
    t.index ["task_id"], name: "index_questions_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name"
    t.integer "difficulty"
    t.bigint "topic_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "task_type"
    t.index ["topic_id"], name: "index_tasks_on_topic_id"
  end

  create_table "topics", force: :cascade do |t|
    t.string "name"
    t.integer "score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "prerequisite_id"
    t.index ["prerequisite_id"], name: "index_topics_on_prerequisite_id"
  end

  add_foreign_key "answers", "questions"
  add_foreign_key "questions", "tasks"
  add_foreign_key "tasks", "topics"
  add_foreign_key "topics", "topics", column: "prerequisite_id"
end
