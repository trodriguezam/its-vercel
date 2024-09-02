# db/seeds.rb

Topic.destroy_all

# Creación de tópicos de ejemplo
topics = [
  { name: 'Variables Aleatorias', prerequisites: '' },
  { name: 'Distribuciones Discretas', prerequisites: 'Variables Aleatorias' },
  { name: 'Distribuciones Continuas', prerequisites: 'Variables Aleatorias' },
  { name: 'Estadísticos', prerequisites: 'Distribuciones Discretas, Distribuciones Continuas' },
  { name: 'Inferencia Estadística', prerequisites: 'Estadísticos' },
  { name: 'Modelos Binomiales', prerequisites: 'Distribuciones Discretas' },
  { name: 'Modelos Normales', prerequisites: 'Distribuciones Continuas' },
]

topics.each do |topic|
  Topic.create!(topic)
end

puts "Created #{Topic.count} topics"