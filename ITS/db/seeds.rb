Answer.destroy_all
Question.destroy_all
Task.destroy_all
Topic.destroy_all

topic = Topic.create(name: "Estática de sólidos rígidos")

task = Task.create(name: "Tipos de Fuerzas", topic_id: topic.id, task_type: "Option", difficulty: 1)

question1 = Question.create(task_id: task.id, question_text: "¿Cuál de las siguientes fuerzas es una fuerza de contacto?")

Answer.create(question_id: question1.id, answer_text: "Fuerza de gravedad", correct: false)
Answer.create(question_id: question1.id, answer_text: "Fuerza normal", correct: true)
Answer.create(question_id: question1.id, answer_text: "Fuerza electroestática", correct: false)
Answer.create(question_id: question1.id, answer_text: "Fuerza de tensión", correct: false)

question2 = Question.create(task_id: task.id, question_text: "¿Cuál de las siguientes fuerzas es una fuerza de campo?")

Answer.create(question_id: question2.id, answer_text: "Fuerza de gravedad", correct: true)
Answer.create(question_id: question2.id, answer_text: "Fuerza normal", correct: false)
Answer.create(question_id: question2.id, answer_text: "Fuerza de roce", correct: false)
Answer.create(question_id: question2.id, answer_text: "Fuerza de tensión", correct: false)

puts "Seed finished"