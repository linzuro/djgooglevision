const io = require('socket.io');
const jwt = require('jwt-simple');

let _socketServer;
const setUp = (server)=> {
  _socketServer = io(server);
  _socketServer.on('connection', (client)=> {
    client.emit('foo', 'bar');
    client.on('identify', (token)=> {
      client.userId = jwt.decode(token, process.env.JWT).id;
      console.log(client.userId);
    });
  });
}

const socketServer = ()=> _socketServer;

module.exports = {
  setUp,
  socketServer
};