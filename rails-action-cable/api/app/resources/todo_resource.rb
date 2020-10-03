class TodoResource < JSONAPI::Resource
  after_create :notify_clients

  attribute :name

  def self.creatable_fields(context)
    super + %i[id]
  end

  private

  def notify_clients
    ActionCable.server.broadcast 'todos', serialized_model
  end

  def serialized_model
    serializer = JSONAPI::ResourceSerializer.new(TodoResource)
    serializer.object_hash(self, nil)
  end
end
