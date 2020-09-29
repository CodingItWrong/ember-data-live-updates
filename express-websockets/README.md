# Ember Data Action Cable

This repo contains an Ember frontend and Express backend. The Express backend sends live updates to the frontend via a WebSocket connection.

The following technologies are used:
* Frontend: Ember Data
* Backend: Express, Sequelize, and `jsonapi-serializer`
* Database: Postgres
* WebSocket connection: `websocket`

## Installation

## Running

## Trying It Out

## Implementation Notes
In our Sequelize migration to create the Todos table, we set it up to use a UUID field as the primary key. This will make it easier to prevent duplicate records on the frontend.

```js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Todos', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      //...
    });
  },
  //...
};
```

We configured our Todo model to indicate that the ID is a UUID as well, along with the default value:

```js
Todo.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  //...
}, {
```

In a `websockets.js` file, we use `new WebSocketServer()` to create a server, then attach it to our Express HTTP server. We set it up to track all the connections it receives. And we create a `sendUpdate` function that will send data to all connections.

In our `POST /todos` route, after saving a record to the database, we send it out over the WebSocket connections.

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

We set up our WebSocket connection in the `ApplicationController`, but it could be done anywhere you can inject the store service. We call `new WebSocket()` to create the connection, connecting to our server at `ws://localhost:3000`.

When we receive data over the WebSocket, we assume it is a todo model, and we `pushPayload()` into the store.
