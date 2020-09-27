class TodoResource < JSONAPI::Resource
  after_create :notify_clients

  attributes :id, :name

  private

  def notify_clients
    serializer = JSONAPI::ResourceSerializer.new(TodoResource)
    resource = TodoResource.new(_model, nil)
    hash = serializer.object_hash(resource, nil)

    ActionCable.server.broadcast 'todos', hash
  end
end
