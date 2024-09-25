Answer.destroy_all
UserQuestion.destroy_all
UserQuestion.destroy_all
Question.destroy_all
Task.destroy_all
Topic.destroy_all

topic = Topic.create(name: "Estática de sólidos rígidos")

task1 = Task.create(name: "Tipos de Fuerzas", topic_id: topic.id, task_type: "Option", difficulty: 1)
task2 = Task.create(name: "DCL Simple", topic_id: topic.id, task_type: "Development", difficulty: 1)
task3 = Task.create(name: "DCL con fricción", topic_id: topic.id, task_type: "Development", difficulty: 2)
task4 = Task.create(name: "DCL Complejo", topic_id: topic.id, task_type: "Development", difficulty: 3)

question1 = Question.create(task_id: task1.id, question_text: "¿Cuál de las siguientes fuerzas es una fuerza de contacto?")

Answer.create(question_id: question1.id, answer_text: "Fuerza de gravedad", correct: false)
Answer.create(question_id: question1.id, answer_text: "Fuerza normal", correct: true)
Answer.create(question_id: question1.id, answer_text: "Fuerza electroestática", correct: false)
Answer.create(question_id: question1.id, answer_text: "Fuerza de tensión", correct: false)

question2 = Question.create(task_id: task1.id, question_text: "¿Cuál de las siguientes fuerzas es una fuerza de campo?")

Answer.create(question_id: question2.id, answer_text: "Fuerza de gravedad", correct: true)
Answer.create(question_id: question2.id, answer_text: "Fuerza normal", correct: false)
Answer.create(question_id: question2.id, answer_text: "Fuerza de roce", correct: false)
Answer.create(question_id: question2.id, answer_text: "Fuerza de tensión", correct: false)

Question.create(task_id: task2.id, question_text: 'Cual debe ser el valor de Fx para que el sistema esté en equilibrio?',
    hint: 'hint11;hint12;hint13')

Question.create(task_id: task3.id, question_text: 'Cual debe ser el valor de Fx para que el objeto entre en movimiento? Considere g=10 m/s² y μ=0.2',
    hint: 'hint21;hint22;hint23')

Question.create(task_id: task4.id, question_text: 'Cual debe ser el valor de Fx e Fy para que el sistema esté en equilibrio?',
    hint: 'hint311;hint312;hint313|hint321;hint322;hint323')

puts "Seed finished"