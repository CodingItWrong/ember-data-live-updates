const WebSocketServer = require('websocket').server;

const connections = [];

const configureWebSockets = httpServer => {
  const wsServer = new WebSocketServer({ httpServer });

  wsServer.on('request', request => {
    const connection = request.accept();
    connections.push(connection);
    console.log('accepted connection');

    connection.on('close', () => {
      console.log('closing connection');
      removeElement(connections, connection);
    });
  });
}

const sendUpdate = data => {
  console.log('sending updates');
  connections.forEach(connection => {
    console.log('sending update');
    connection.sendUTF(JSON.stringify(data));
  });
}

function removeElement(array, element) {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

module.exports = {
  configureWebSockets,
  sendUpdate,
};
