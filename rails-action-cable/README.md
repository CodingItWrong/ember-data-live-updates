# Ember Data Action Cable

This repo contains an Ember frontend and Rails backend. The Rails backend sends live updates to the frontend via a WebSocket connection.

The following technologies are used:
* Frontend: Ember Data
* Backend: Rails and JSONAPI::Resources
* Database: Postgres
* WebSocket connection: Action Cable

## Requirements

* [Ruby](https://www.ruby-lang.org/en/)
* [Postgres](https://postgresapp.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://guides.emberjs.com/release/getting-started/quick-start/#toc_install-ember)

## Installation

```bash
$ cd api
$ bundle install
$ cd ../frontend
$ yarn install
```

## Running

In one terminal:

```bash
$ cd api
$ rails s
```

In another terminal:

```bash
$ cd frontend
$ ember s
```

## Trying It Out

Visit the app at <http://localhost:4200> in two different tabs.

Add a todo in one tab. You should see the todo appear in the list in both tabs.

## Implementation Notes
*More details can be found in the blog post [Ember Data Live Updates](https://codingitwrong.com/2020/10/02/ember-data-live-updates-with-rails.html).*

We set up our Rails backend with API mode, and we left Action Cable in by default.

We set up our database to use UUIDs as primary keys. This will make it easier to prevent duplicate records on the frontend.

To support this, we run a migration to enable the appropriate extensions in Postgres:

```ruby
class EnableUuids < ActiveRecord::Migration[6.0]
  def change
    enable_extension 'uuid-ossp'
    enable_extension 'pgcrypto'
  end
end
```

When we create our todo table, we set it to use UUID primary keys:

```ruby
class CreateTodos < ActiveRecord::Migration[6.0]
  def change
    create_table :todos, id: :uuid do |t|
      t.string :name

      t.timestamps
    end
  end
end
```

We create a `TodosChannel` and give the channel a name: "todos".

In the `TodoResource` class, we add a callback to run `after_create` of a todo. (We don't put the callback in the model so that if we work with the models in a seeder or the console, web socket messages won't be sent.) We use `JSONAPI::ResourceSerializer` to serialize the todo in JSON:API format, then we send it over the channel using `ActionCable.server.broadcast`.

In the Ember frontend, we add the `uuid` NPM package, then configure our Ember Data `ApplicationAdapter` to automatically set the ID field to a UUID. Here are the relevant parts:

```js
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { v4 } from 'uuid';

export default class ApplicationAdapter extends JSONAPIAdapter {
  generateIdForRecord() {
    return v4();
  }
}
```

`actioncable` is installed as an NPM package.

We set the Action Cable connection in the `ApplicationController`, but it could be done anywhere you can inject the store service. We call `ActionCable.createConsumer()` to create the connection, connecting to the default Action Cable path at `http://localhost:3000/cable`, the default Action Cable path. Then we create a subscription to the `TodosChannel`.

When we receive data over the channel, we assume it is a todo model, and we `pushPayload()` into the store.
