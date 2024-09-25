class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :role, :time_spent
end