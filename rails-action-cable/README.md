# Ember Data Action Cable

This repo contains an Ember frontend and Rails backend. The Rails backend sends live updates to the frontend via a WebSocket connection.

The following technologies are used:
* Frontend: Ember Data
* Backend: JSONAPI::Resources
* WebSocket connection: Rails Action Cable

## Installation

## Running

## Trying It Out

## Implementation Notes
We set up our Rails backend with API mode, and we left Action Cable in by default.

We create a `TodosChannel` and give the channel a name: "todos".

In the `TodoResource` class, we add a callback to run `after_create` of a todo. (We don't put the callback in the model so that if we work with the models in a seeder or the console, web socket messages won't be sent.) We use `JSONAPI::ResourceSerializer` to serialize the todo in JSON:API format, then we send it over the channel using `ActionCable.server.broadcast`.

In the Ember frontend, `actioncable` is installed as an NPM package.

We set the Action Cable connection in the `ApplicationController`, but it could be done anywhere you can inject the store service. We call `ActionCable.createConsumer()` to create the connection, connecting to the default Action Cable path at `http://localhost:3000/cable`, the default Action Cable path. Then we create a subscription to the `TodosChannel`.

When we receive data, we assume it is a todo model, and we `push()` it into the store. Note that Ember Data usually translates the plural "todos" type into the singular "todo" type for us, but because we are pushing a record directly, we need to do that transformation ourselves.
