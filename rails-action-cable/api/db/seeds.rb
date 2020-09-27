# frozen_string_literal: true
User.create!(email: 'example@example.com', password: 'password')

3.times do |n|
  Todo.create!(name: "Todo #{n+1}")
end
