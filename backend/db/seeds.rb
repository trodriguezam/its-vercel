UserTaskSkip.destroy_all
Answer.destroy_all
UserQuestion.destroy_all
Question.destroy_all
Task.destroy_all
Topic.destroy_all

# Topic: Centro de Gravedad
topic1 = Topic.create(name: "Centro de Gravedad")

# Tasks de tipo "Option" (3 tasks, con 3-5 preguntas cada una, total 10 preguntas)
task1 = Task.create(name: "Concepto de Centro de Gravedad", topic_id: topic1.id, task_type: "Option", difficulty: 1)
task2 = Task.create(name: "Centro de Gravedad en Objetos Simples", topic_id: topic1.id, task_type: "Option", difficulty: 2)
task3 = Task.create(name: "Efecto del Centro de Gravedad en Estabilidad", topic_id: topic1.id, task_type: "Option", difficulty: 3)

# Preguntas para Task 1 (dificultad 1, 3 preguntas)
question1 = Question.create(task_id: task1.id, question_text: "¿Qué es el centro de gravedad?")
Answer.create(question_id: question1.id, answer_text: "El punto donde la masa está equilibrada", correct: true)
Answer.create(question_id: question1.id, answer_text: "El punto más alto de un objeto", correct: false)
Answer.create(question_id: question1.id, answer_text: "El lugar donde la gravedad es máxima", correct: false)

question2 = Question.create(task_id: task1.id, question_text: "¿Dónde se encuentra el centro de gravedad de una barra homogénea?")
Answer.create(question_id: question2.id, answer_text: "En un extremo", correct: false)
Answer.create(question_id: question2.id, answer_text: "Depende de la masa", correct: false)
Answer.create(question_id: question2.id, answer_text: "En el centro", correct: true)

question3 = Question.create(task_id: task1.id, question_text: "¿Qué sucede con el centro de gravedad si se redistribuye la masa de un objeto?")
Answer.create(question_id: question3.id, answer_text: "Cambia de posición", correct: true)
Answer.create(question_id: question3.id, answer_text: "Se mantiene igual", correct: false)
Answer.create(question_id: question3.id, answer_text: "Desaparece", correct: false)

# Preguntas para Task 2 (dificultad 2, 4 preguntas)
question4 = Question.create(task_id: task2.id, question_text: "¿Cuál es el centro de gravedad de un triángulo equilátero?")
Answer.create(question_id: question4.id, answer_text: "En el centro de la base", correct: false)
Answer.create(question_id: question4.id, answer_text: "En el vértice", correct: false)
Answer.create(question_id: question4.id, answer_text: "A un tercio de la altura", correct: true)

question5 = Question.create(task_id: task2.id, question_text: "¿Dónde se encuentra el centro de gravedad en una rueda perfecta?")
Answer.create(question_id: question5.id, answer_text: "En el borde", correct: false)
Answer.create(question_id: question5.id, answer_text: "En el centro", correct: true)
Answer.create(question_id: question5.id, answer_text: "Depende de la velocidad de rotación", correct: false)

question6 = Question.create(task_id: task2.id, question_text: "¿Qué fórmula general se usa para calcular el centro de gravedad?")
Answer.create(question_id: question6.id, answer_text: "Producto de la masa total por la aceleración de la gravedad", correct: false)
Answer.create(question_id: question6.id, answer_text: "Sumatoria de (masa * posición) / sumatoria de masas", correct: true)
Answer.create(question_id: question6.id, answer_text: "Sumatoria de fuerzas sobre sumatoria de masas", correct: false)

question7 = Question.create(task_id: task2.id, question_text: "¿Qué sucede si el centro de gravedad de un objeto está fuera de su base de apoyo?")
Answer.create(question_id: question7.id, answer_text: "El objeto se mantiene estable", correct: false)
Answer.create(question_id: question7.id, answer_text: "El objeto se equilibra", correct: false)
Answer.create(question_id: question7.id, answer_text: "El objeto se cae", correct: true)

# Preguntas para Task 3 (dificultad 3, 3 preguntas)
question8 = Question.create(task_id: task3.id, question_text: "¿Cómo afecta la inclinación de un objeto a su centro de gravedad?")
Answer.create(question_id: question8.id, answer_text: "Lo desplaza hacia afuera del objeto", correct: true)
Answer.create(question_id: question8.id, answer_text: "Lo desplaza hacia abajo", correct: false)
Answer.create(question_id: question8.id, answer_text: "No lo afecta", correct: false)

question9 = Question.create(task_id: task3.id, question_text: "¿Qué sucede con la estabilidad de un objeto cuando su centro de gravedad es más bajo?")
Answer.create(question_id: question9.id, answer_text: "No cambia", correct: false)
Answer.create(question_id: question9.id, answer_text: "La estabilidad aumenta", correct: true)
Answer.create(question_id: question9.id, answer_text: "La estabilidad disminuye", correct: false)

question10 = Question.create(task_id: task3.id, question_text: "¿Qué efecto tiene el centro de gravedad sobre la rotación de un objeto?")
Answer.create(question_id: question10.id, answer_text: "Determina el punto alrededor del cual el objeto puede rotar", correct: true)
Answer.create(question_id: question10.id, answer_text: "Impide la rotación", correct: false)
Answer.create(question_id: question10.id, answer_text: "No tiene efecto en la rotación", correct: false)

# Tasks de tipo "Development" (2 tasks con hints)
task4 = Task.create(name: "Cálculo del Centro de Gravedad en Sistemas Simples", topic_id: topic1.id, task_type: "Development", difficulty: 1)
task5 = Task.create(name: "Centro de Gravedad en Sistemas Complejos", topic_id: topic1.id, task_type: "Development", difficulty: 2)

Question.create(task_id: task4.id, question_text: "Calcula el centro de gravedad de un sistema de dos masas de 3 kg a 2 m y 5 kg a 4 m", hint:
    "Usa la fórmula: (m1*x1 + m2*x2) / (m1 + m2);
    Recuerda que el centro de gravedad se encuentra en la posición donde la masa total del sistema actúa.;
    Si necesitas, puedes dibujar un gráfico con las posiciones de las masas para visualizar mejor el problema.")
Question.create(task_id: task5.id, question_text: "Determina el centro de gravedad de un sistema de 3 masas en un plano cartesiano, con m1=M1 en (x1, y1), m2=M2 en (x2, y2), y m3=M3 en (x3, y3)", hint:
    "Descompón en componentes X y Y y calcula por separado;
    Asegúrate de que las posiciones de las masas estén correctamente representadas en el plano cartesiano.;
    Utiliza las fórmulas X_cg = (m1*x1 + m2*x2 + m3*x3) / (m1 + m2 + m3) y Y_cg = (m1*y1 + m2*y2 + m3*y3) / (m1 + m2 + m3)")


# ========================================================================================================
# ========================================================================================================


# Topic: Tipos de Fuerzas más Comunes
topic2 = Topic.create(name: "Tipos de Fuerzas más Comunes")

# Tasks de tipo "Option" (3 tasks, con 3-5 preguntas cada una, total 10 preguntas)
task1 = Task.create(name: "Concepto de Fuerzas", topic_id: topic2.id, task_type: "Option", difficulty: 1)
task2 = Task.create(name: "Fuerzas de Contacto y Campo", topic_id: topic2.id, task_type: "Option", difficulty: 2)
task3 = Task.create(name: "Fuerzas y sus Efectos", topic_id: topic2.id, task_type: "Option", difficulty: 3)

# Preguntas para Task 1 (dificultad 1, 3 preguntas)
question1 = Question.create(task_id: task1.id, question_text: "¿Qué es una fuerza?")
Answer.create(question_id: question1.id, answer_text: "La energía de un objeto", correct: false)
Answer.create(question_id: question1.id, answer_text: "La masa de un objeto", correct: false)
Answer.create(question_id: question1.id, answer_text: "Una interacción que puede cambiar el estado de movimiento de un objeto", correct: true)

question2 = Question.create(task_id: task1.id, question_text: "¿Cuál de las siguientes es una fuerza de contacto?")
Answer.create(question_id: question2.id, answer_text: "Fuerza gravitacional", correct: false)
Answer.create(question_id: question2.id, answer_text: "Fuerza normal", correct: true)
Answer.create(question_id: question2.id, answer_text: "Fuerza magnética", correct: false)

question3 = Question.create(task_id: task1.id, question_text: "¿Cómo se mide la fuerza?")
Answer.create(question_id: question3.id, answer_text: "En Joules (J)", correct: false)
Answer.create(question_id: question3.id, answer_text: "En Newtons (N)", correct: true)
Answer.create(question_id: question3.id, answer_text: "En metros (m)", correct: false)

# Preguntas para Task 2 (dificultad 2, 4 preguntas)
question4 = Question.create(task_id: task2.id, question_text: "¿Qué fuerza actúa a distancia?")
Answer.create(question_id: question4.id, answer_text: "Fuerza de fricción", correct: false)
Answer.create(question_id: question4.id, answer_text: "Fuerza normal", correct: false)
Answer.create(question_id: question4.id, answer_text: "Fuerza gravitacional", correct: true)

question5 = Question.create(task_id: task2.id, question_text: "¿Qué dirección tiene la fuerza de fricción?")
Answer.create(question_id: question5.id, answer_text: "Opuesta al movimiento", correct: true)
Answer.create(question_id: question5.id, answer_text: "A favor del movimiento", correct: false)
Answer.create(question_id: question5.id, answer_text: "Perpendicular al movimiento", correct: false)

question6 = Question.create(task_id: task2.id, question_text: "¿Cuál de las siguientes es una fuerza de campo?")
Answer.create(question_id: question6.id, answer_text: "Fuerza normal", correct: false)
Answer.create(question_id: question6.id, answer_text: "Fuerza eléctrica", correct: true)
Answer.create(question_id: question6.id, answer_text: "Fuerza de tensión", correct: false)

question7 = Question.create(task_id: task2.id, question_text: "¿Qué fuerza mantiene a los objetos en la superficie terrestre?")
Answer.create(question_id: question7.id, answer_text: "Fuerza gravitacional", correct: true)
Answer.create(question_id: question7.id, answer_text: "Fuerza de roce", correct: false)
Answer.create(question_id: question7.id, answer_text: "Fuerza de tensión", correct: false)

# Preguntas para Task 3 (dificultad 3, 3 preguntas)
question8 = Question.create(task_id: task3.id, question_text: "¿Qué efecto tiene una fuerza neta sobre un objeto?")
Answer.create(question_id: question8.id, answer_text: "Produce una aceleración", correct: true)
Answer.create(question_id: question8.id, answer_text: "Produce una masa", correct: false)
Answer.create(question_id: question8.id, answer_text: "Produce una temperatura", correct: false)

question9 = Question.create(task_id: task3.id, question_text: "¿Qué ocurre cuando las fuerzas sobre un objeto están equilibradas?")
Answer.create(question_id: question9.id, answer_text: "El objeto acelera", correct: false)
Answer.create(question_id: question9.id, answer_text: "El objeto cambia de forma", correct: false)
Answer.create(question_id: question9.id, answer_text: "El objeto permanece en reposo o en movimiento constante", correct: true)

question10 = Question.create(task_id: task3.id, question_text: "¿Qué tipo de fuerza es responsable de la tracción de un automóvil?")
Answer.create(question_id: question10.id, answer_text: "Fuerza normal", correct: false)
Answer.create(question_id: question10.id, answer_text: "Fuerza de fricción", correct: true)
Answer.create(question_id: question10.id, answer_text: "Fuerza gravitacional", correct: false)

# Tasks de tipo "Development" (2 tasks con hints)
task4 = Task.create(name: "Cálculo de Fuerza de Fricción", topic_id: topic2.id, task_type: "Development", difficulty: 1)
task5 = Task.create(name: "Cálculo de Fuerzas Netas", topic_id: topic2.id, task_type: "Development", difficulty: 2)

Question.create(task_id: task4.id, question_text: "Calcula la fuerza de fricción que actúa sobre un objeto de 10 kg en una superficie con un coeficiente de fricción de 0.3", hint:
    "Usa la fórmula: F_roz = μ * N, donde N es el peso del objeto;
    Recuerda que la fuerza normal en una superficie horizontal es igual al peso del objeto.;
    Comprueba la dirección de la fuerza de fricción; siempre actúa en dirección opuesta al movimiento.")
Question.create(task_id: task5.id, question_text: "Determina la fuerza neta que actúa sobre un objeto de 5 kg si se le aplica una fuerza de 10 N hacia la derecha y una de 10 N hacia la izquierda", hint:
    "Resta las fuerzas opuestas para encontrar la fuerza neta;
    Asegúrate de considerar el signo de las fuerzas, ya que una fuerza hacia la derecha es positiva y una hacia la izquierda es negativa.;
    Puedes representar las fuerzas en un diagrama para facilitar el cálculo.")


# ========================================================================================================
# ========================================================================================================


# Topic: Diagrama de Cuerpo Libre
topic3 = Topic.create(name: "Diagrama de Cuerpo Libre")

# Tasks de tipo "Option" (3 tasks, con 3-5 preguntas cada una, total 10 preguntas)
task1 = Task.create(name: "Concepto Básico de Diagrama de Cuerpo Libre", topic_id: topic3.id, task_type: "Option", difficulty: 1)
task2 = Task.create(name: "Fuerzas en DCL", topic_id: topic3.id, task_type: "Option", difficulty: 2)
task3 = Task.create(name: "Análisis de DCL Complejo", topic_id: topic3.id, task_type: "Option", difficulty: 3)

# Preguntas para Task 1 (dificultad 1, 3 preguntas)
question1 = Question.create(task_id: task1.id, question_text: "¿Qué es un diagrama de cuerpo libre?")
Answer.create(question_id: question1.id, answer_text: "Una representación de las energías que actúan sobre un objeto", correct: false)
Answer.create(question_id: question1.id, answer_text: "Una representación gráfica de las fuerzas que actúan sobre un objeto", correct: true)
Answer.create(question_id: question1.id, answer_text: "Un gráfico de las velocidades de un objeto", correct: false)

question2 = Question.create(task_id: task1.id, question_text: "¿Qué fuerza NO se incluye en un diagrama de cuerpo libre?")
Answer.create(question_id: question2.id, answer_text: "Fuerza normal", correct: false)
Answer.create(question_id: question2.id, answer_text: "Peso", correct: false)
Answer.create(question_id: question2.id, answer_text: "Aceleración centrífuga", correct: true)

question3 = Question.create(task_id: task1.id, question_text: "¿Qué dirección tiene la fuerza de fricción en un diagrama de cuerpo libre?")
Answer.create(question_id: question3.id, answer_text: "Opuesta al movimiento", correct: true)
Answer.create(question_id: question3.id, answer_text: "A favor del movimiento", correct: false)
Answer.create(question_id: question3.id, answer_text: "Perpendicular al movimiento", correct: false)

# Preguntas para Task 2 (dificultad 2, 4 preguntas)
question4 = Question.create(task_id: task2.id, question_text: "¿Qué se representa en un diagrama de cuerpo libre?")
Answer.create(question_id: question4.id, answer_text: "Las aceleraciones del objeto", correct: false)
Answer.create(question_id: question4.id, answer_text: "Las fuerzas que actúan sobre un objeto", correct: true)
Answer.create(question_id: question4.id, answer_text: "Las posiciones del objeto", correct: false)

question5 = Question.create(task_id: task2.id, question_text: "¿Qué fuerza actúa siempre hacia abajo en un diagrama de cuerpo libre?")
Answer.create(question_id: question5.id, answer_text: "La fuerza normal", correct: false)
Answer.create(question_id: question5.id, answer_text: "La fuerza de tensión", correct: false)
Answer.create(question_id: question5.id, answer_text: "El peso", correct: true)

question6 = Question.create(task_id: task2.id, question_text: "¿Qué ocurre si la suma de las fuerzas en un diagrama de cuerpo libre es cero?")
Answer.create(question_id: question6.id, answer_text: "El objeto está en equilibrio", correct: true)
Answer.create(question_id: question6.id, answer_text: "El objeto acelera", correct: false)
Answer.create(question_id: question6.id, answer_text: "El objeto cambia de dirección", correct: false)

question7 = Question.create(task_id: task2.id, question_text: "¿Qué fuerza se dibuja perpendicular a la superficie en un DCL?")
Answer.create(question_id: question7.id, answer_text: "Fuerza normal", correct: true)
Answer.create(question_id: question7.id, answer_text: "Fuerza de fricción", correct: false)
Answer.create(question_id: question7.id, answer_text: "Fuerza de gravedad", correct: false)

# Preguntas para Task 3 (dificultad 3, 3 preguntas)
question8 = Question.create(task_id: task3.id, question_text: "¿Qué indica un diagrama de cuerpo libre cuando todas las fuerzas están equilibradas?")
Answer.create(question_id: question8.id, answer_text: "El objeto está acelerando", correct: false)
Answer.create(question_id: question8.id, answer_text: "El objeto está en equilibrio estático o dinámico", correct: true)
Answer.create(question_id: question8.id, answer_text: "El objeto está cambiando de dirección", correct: false)

question9 = Question.create(task_id: task3.id, question_text: "¿Qué fuerza actúa en dirección opuesta al peso en un objeto sobre una superficie horizontal?")
Answer.create(question_id: question9.id, answer_text: "Fuerza de fricción", correct: false)
Answer.create(question_id: question9.id, answer_text: "Fuerza centrípeta", correct: false)
Answer.create(question_id: question9.id, answer_text: "Fuerza normal", correct: true)

question10 = Question.create(task_id: task3.id, question_text: "¿Qué fuerza se representa en un DCL cuando un objeto cuelga de una cuerda?")
Answer.create(question_id: question10.id, answer_text: "Fuerza de tensión", correct: true)
Answer.create(question_id: question10.id, answer_text: "Fuerza de fricción", correct: false)
Answer.create(question_id: question10.id, answer_text: "Fuerza normal", correct: false)

# Tasks de tipo "Development" (2 tasks con hints)
task4 = Task.create(name: "DCL de un objeto en reposo", topic_id: topic3.id, task_type: "Development", difficulty: 1)
task5 = Task.create(name: "DCL de un objeto en movimiento en una pendiente", topic_id: topic3.id, task_type: "Development", difficulty: 2)

Question.create(task_id: task4.id, question_text: "Un bloque de 6 kg está en reposo suspendido por una cuerda vertical. Calcula la tensión en la cuerda.", hint:
    "Considera que la tensión en la cuerda está equilibrada con la fuerza de gravedad  m ⋅ g.;
    Recuerda que la tensión se calcula como T = m ⋅ g.;
    En este caso la magnitud de la tensión será igual a la del peso porque no hay movimiento.")
Question.create(task_id: task5.id, question_text: "Un objeto de 10 kg está sobre una pendiente inclinada 30° respecto a la horizontal. Calcula la magnitud de la fuerza normal que actúa sobre el objeto. Asume g = 10 m/s²", hint:
    "Dibuja el DCL del objeto y descompón las fuerzas en los ejes X y Y respecto a la pendiente.;
    Enfócate en descomponer la fuerza de gravedad m ⋅ g en sus componentes x e y.;
    Usa la fórmula para la componente perpendicular al plano: F⊥ = m ⋅ g ⋅ cos(θ).")


# ========================================================================================================
# ========================================================================================================


# Topic: Condiciones de Equilibrio y Gravedad
topic4 = Topic.create(name: "Condiciones de Equilibrio y Gravedad")

# Tasks de tipo "Option" (3 tasks, con 3-5 preguntas cada una, total 10 preguntas)
task1 = Task.create(name: "Conceptos Básicos de Equilibrio", topic_id: topic4.id, task_type: "Option", difficulty: 1)
task2 = Task.create(name: "Equilibrio Estático y Dinámico", topic_id: topic4.id, task_type: "Option", difficulty: 2)
task3 = Task.create(name: "Equilibrio en Objetos Complejos", topic_id: topic4.id, task_type: "Option", difficulty: 3)

# Preguntas para Task 1 (dificultad 1, 3 preguntas)
question1 = Question.create(task_id: task1.id, question_text: "¿Qué es el equilibrio estático?")
Answer.create(question_id: question1.id, answer_text: "Cuando un objeto está en reposo y todas las fuerzas están equilibradas", correct: true)
Answer.create(question_id: question1.id, answer_text: "Cuando un objeto se está moviendo a velocidad constante", correct: false)
Answer.create(question_id: question1.id, answer_text: "Cuando un objeto cambia de dirección", correct: false)

question2 = Question.create(task_id: task1.id, question_text: "¿Qué ocurre si las fuerzas que actúan sobre un objeto no están equilibradas?")
Answer.create(question_id: question2.id, answer_text: "El objeto desacelera", correct: false)
Answer.create(question_id: question2.id, answer_text: "El objeto acelera en la dirección de la fuerza neta", correct: true)
Answer.create(question_id: question2.id, answer_text: "El objeto permanece en reposo", correct: false)

question3 = Question.create(task_id: task1.id, question_text: "¿Qué es necesario para que un objeto esté en equilibrio traslacional?")
Answer.create(question_id: question3.id, answer_text: "Que la suma de los momentos sea cero", correct: false)
Answer.create(question_id: question3.id, answer_text: "Que la masa del objeto sea constante", correct: false)
Answer.create(question_id: question3.id, answer_text: "Que la suma de las fuerzas sea cero", correct: true)

# Preguntas para Task 2 (dificultad 2, 4 preguntas)
question4 = Question.create(task_id: task2.id, question_text: "¿Qué es el equilibrio dinámico?")
Answer.create(question_id: question4.id, answer_text: "Cuando un objeto acelera", correct: false)
Answer.create(question_id: question4.id, answer_text: "Cuando un objeto se mueve a velocidad constante y las fuerzas están equilibradas", correct: true)
Answer.create(question_id: question4.id, answer_text: "Cuando un objeto está en reposo", correct: false)

question5 = Question.create(task_id: task2.id, question_text: "¿Qué condiciones deben cumplirse para que un objeto esté en equilibrio rotacional?")
Answer.create(question_id: question5.id, answer_text: "Que la suma de los momentos sea cero", correct: true)
Answer.create(question_id: question5.id, answer_text: "Que la suma de las fuerzas sea cero", correct: false)
Answer.create(question_id: question5.id, answer_text: "Que el objeto no tenga velocidad", correct: false)

question6 = Question.create(task_id: task2.id, question_text: "¿Qué tipo de fuerza produce un momento en un objeto?")
Answer.create(question_id: question6.id, answer_text: "Una fuerza aplicada en el centro de masa", correct: false)
Answer.create(question_id: question6.id, answer_text: "Cualquier fuerza aplicada al objeto", correct: false)
Answer.create(question_id: question6.id, answer_text: "Una fuerza aplicada a una distancia del punto de rotación", correct: true)

question7 = Question.create(task_id: task2.id, question_text: "¿Qué ocurre si un objeto en equilibrio tiene su centro de gravedad más alto?")
Answer.create(question_id: question7.id, answer_text: "El objeto es más estable", correct: false)
Answer.create(question_id: question7.id, answer_text: "El objeto es menos estable", correct: true)
Answer.create(question_id: question7.id, answer_text: "La estabilidad no se ve afectada", correct: false)

# Preguntas para Task 3 (dificultad 3, 3 preguntas)
question8 = Question.create(task_id: task3.id, question_text: "¿Cómo afecta el centro de gravedad a la estabilidad de un objeto en equilibrio?")
Answer.create(question_id: question8.id, answer_text: "Cuanto más alto el centro de gravedad, mayor la estabilidad", correct: false)
Answer.create(question_id: question8.id, answer_text: "El centro de gravedad no afecta la estabilidad", correct: false)
Answer.create(question_id: question8.id, answer_text: "Cuanto más bajo el centro de gravedad, mayor la estabilidad", correct: true)

question9 = Question.create(task_id: task3.id, question_text: "¿Qué ocurre si las fuerzas y momentos sobre un objeto están equilibrados?")
Answer.create(question_id: question9.id, answer_text: "El objeto acelera", correct: false)
Answer.create(question_id: question9.id, answer_text: "El objeto permanece en equilibrio", correct: true)
Answer.create(question_id: question9.id, answer_text: "El objeto rota", correct: false)

question10 = Question.create(task_id: task3.id, question_text: "¿Qué es necesario para que un objeto en una pendiente esté en equilibrio?")
Answer.create(question_id: question10.id, answer_text: "Que no haya fricción", correct: false)
Answer.create(question_id: question10.id, answer_text: "Que la masa del objeto sea constante", correct: false)
Answer.create(question_id: question10.id, answer_text: "Que la suma de las fuerzas y momentos sea cero", correct: true)

# Tasks de tipo "Development" (2 tasks con hints)
task4 = Task.create(name: "Cálculo de Equilibrio Traslacional", topic_id: topic4.id, task_type: "Development", difficulty: 1)
task5 = Task.create(name: "Cálculo de Equilibrio Rotacional", topic_id: topic4.id, task_type: "Development", difficulty: 2)

Question.create(task_id: task4.id, question_text: "Si hay una fuerza a X metros del pivote, cuánto tendría que valer esta para que la barra de 4 metros, con un peso de 100 N, esté en equilibrio.", hint:
    "Usa el principio de momentos: la suma de los momentos respecto a cualquier punto debe ser cero.;
     Identifica el punto de aplicación de la fuerza que deseas calcular para equilibrar la barra.;
     Recuerda que la suma de los momentos en equilibrio debe ser cero, así que establece una ecuación basada en eso.")
Question.create(task_id: task5.id, question_text: "Determina el momento necesario para equilibrar un objeto que tiene una fuerza de 20 N aplicada a 2 metros del eje de rotación", hint:
    "Usa la fórmula del momento: M = F * d, donde d es la distancia perpendicular desde el eje de rotación.;
    Considera si hay otras fuerzas actuando sobre el objeto que podrían afectar el cálculo del momento.;
    Recuerda que el momento es el producto de la fuerza y la distancia perpendicular al eje de rotación.")


# ========================================================================================================
# ========================================================================================================


# Topic: Rozamiento y Poleas
topic5 = Topic.create(name: "Rozamiento y Poleas")

# Tasks de tipo "Option" (3 tasks, con 3-5 preguntas cada una, total 10 preguntas)
task1 = Task.create(name: "Conceptos Básicos de Rozamiento", topic_id: topic5.id, task_type: "Option", difficulty: 1)
task2 = Task.create(name: "Rozamiento y Fuerzas", topic_id: topic5.id, task_type: "Option", difficulty: 2)
task3 = Task.create(name: "Sistema de Poleas y Eficiencia", topic_id: topic5.id, task_type: "Option", difficulty: 3)

# Preguntas para Task 1 (dificultad 1, 3 preguntas)
question1 = Question.create(task_id: task1.id, question_text: "¿Qué es la fuerza de rozamiento?")
Answer.create(question_id: question1.id, answer_text: "Una fuerza que impulsa los objetos hacia adelante", correct: false)
Answer.create(question_id: question1.id, answer_text: "Una fuerza que se opone al movimiento entre dos superficies en contacto", correct: true)
Answer.create(question_id: question1.id, answer_text: "Una fuerza que acelera los objetos en caída libre", correct: false)

question2 = Question.create(task_id: task1.id, question_text: "¿Cómo afecta el coeficiente de rozamiento al movimiento de un objeto?")
Answer.create(question_id: question2.id, answer_text: "Entre mayor el coeficiente, menor será la fuerza de rozamiento", correct: false)
Answer.create(question_id: question2.id, answer_text: "El coeficiente no afecta al rozamiento", correct: false)
Answer.create(question_id: question2.id, answer_text: "Entre mayor el coeficiente, mayor será la fuerza de rozamiento", correct: true)

question3 = Question.create(task_id: task1.id, question_text: "¿Qué unidad se utiliza para medir el coeficiente de rozamiento?")
Answer.create(question_id: question3.id, answer_text: "No tiene unidad, es adimensional", correct: true)
Answer.create(question_id: question3.id, answer_text: "Newton (N)", correct: false)
Answer.create(question_id: question3.id, answer_text: "Kilogramo (kg)", correct: false)

# Preguntas para Task 2 (dificultad 2, 4 preguntas)
question4 = Question.create(task_id: task2.id, question_text: "¿Qué tipo de fuerza de rozamiento actúa sobre un objeto que está en reposo?")
Answer.create(question_id: question4.id, answer_text: "Fuerza de rozamiento dinámico", correct: false)
Answer.create(question_id: question4.id, answer_text: "Fuerza de rozamiento estático", correct: true)
Answer.create(question_id: question4.id, answer_text: "Fuerza de rozamiento cinético", correct: false)

question5 = Question.create(task_id: task2.id, question_text: "¿Cómo se relaciona la normal con la fuerza de rozamiento?")
Answer.create(question_id: question5.id, answer_text: "La fuerza de rozamiento es inversamente proporcional a la fuerza normal", correct: false)
Answer.create(question_id: question5.id, answer_text: "La fuerza de rozamiento es proporcional a la fuerza normal", correct: true)
Answer.create(question_id: question5.id, answer_text: "No tienen relación", correct: false)

question6 = Question.create(task_id: task2.id, question_text: "¿Qué ocurre si el coeficiente de rozamiento es cero?")
Answer.create(question_id: question6.id, answer_text: "Hay una fuerza de rozamiento muy pequeña", correct: false)
Answer.create(question_id: question6.id, answer_text: "El rozamiento es máximo", correct: false)
Answer.create(question_id: question6.id, answer_text: "No hay ninguna fuerza de rozamiento", correct: true)

question7 = Question.create(task_id: task2.id, question_text: "¿Qué tipo de rozamiento actúa en un objeto en movimiento sobre una superficie?")
Answer.create(question_id: question7.id, answer_text: "Fuerza de rozamiento cinético", correct: true)
Answer.create(question_id: question7.id, answer_text: "Fuerza de rozamiento estático", correct: false)
Answer.create(question_id: question7.id, answer_text: "Fuerza normal", correct: false)

# Preguntas para Task 3 (dificultad 3, 3 preguntas)
question8 = Question.create(task_id: task3.id, question_text: "¿Cómo afecta el rozamiento la eficiencia de un sistema de poleas?")
Answer.create(question_id: question8.id, answer_text: "El rozamiento no afecta la eficiencia del sistema", correct: false)
Answer.create(question_id: question8.id, answer_text: "El rozamiento reduce la eficiencia del sistema", correct: true)
Answer.create(question_id: question8.id, answer_text: "El rozamiento aumenta la eficiencia del sistema", correct: false)

question9 = Question.create(task_id: task3.id, question_text: "¿Qué ventaja mecánica ofrece un sistema de poleas ideal (sin rozamiento)?")
Answer.create(question_id: question9.id, answer_text: "Disminuye la ventaja mecánica debido al rozamiento", correct: false)
Answer.create(question_id: question9.id, answer_text: "La ventaja mecánica se mantiene igual", correct: false)
Answer.create(question_id: question9.id, answer_text: "Aumenta la ventaja mecánica sin pérdida de eficiencia", correct: true)

question10 = Question.create(task_id: task3.id, question_text: "¿Qué fuerza se opone al movimiento en una polea real?")
Answer.create(question_id: question10.id, answer_text: "El rozamiento entre la cuerda y la polea", correct: true)
Answer.create(question_id: question10.id, answer_text: "La fuerza normal", correct: false)
Answer.create(question_id: question10.id, answer_text: "El peso de la cuerda", correct: false)

# Tasks de tipo "Development" (2 tasks con hints)
task4 = Task.create(name: "Cálculo de Fuerza de Rozamiento", topic_id: topic5.id, task_type: "Development", difficulty: 1)
task5 = Task.create(name: "Cálculo de Eficiencia en Sistema de Poleas", topic_id: topic5.id, task_type: "Development", difficulty: 2)

Question.create(task_id: task4.id, question_text: "Calcula la fuerza necesaria para que un bloque de 5 kg entre en movimiento en una superficie con un coeficiente de roce de 0.2", hint:
    "Usa la fórmula: F_roz = μ * N, donde N es la fuerza normal (igual al peso del objeto en este caso).;
    Considera cómo la inclinación de la superficie afectaría la fuerza normal si el bloque no está en una superficie horizontal.;
    Compara los valores de la fuerza de rozamiento con otras fuerzas que actúan sobre el bloque.")
Question.create(task_id: task5.id, question_text: "Cuánto debiese valer la fuerza que actúa sobre m1 para que el sistema esté en equilibrio", hint:
    "Usa el principio de conservación de la energía: la fuerza aplicada en una polea se transmite a la otra.;
    Considera cómo la fuerza aplicada en una polea afecta a las fuerzas en el otro lado del sistema.;
    Recuerda que la fuerza aplicada en una polea se divide entre las dos masas del sistema.")

puts "Seed finished"