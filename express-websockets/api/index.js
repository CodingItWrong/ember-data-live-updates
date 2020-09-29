const express = require('express');
const http = require('http');
const cors = require('cors');
const todoRouter = require('./routes/todos');
const { configureWebSockets } = require('./websockets');

const app = express();
app.use(cors());

app.use('/todos', todoRouter);

const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
configureWebSockets(httpServer);
httpServer.listen(port, () => {
  console.log(`Express ready at http://localhost:${port}`)
});
