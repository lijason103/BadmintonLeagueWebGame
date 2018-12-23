// Setup connections
var express = require('express');
var app = express();
var server = require('http').Server(app);
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  console.log(`a user ${socket.id} connected`);
  // Manage players
  var players = {}
  players[socket.id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    id: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  }

  socket.emit('currentPlayers', players)
  // Tell existing players about the new player
  socket.broadcast.emit('newPlayer', players[socket.id])


  // Handle player disconnect
  socket.on('disconnect', function () {
    console.log('user disconnected')
    delete players[socket.id]
    io.emit('disconnect', socket.id)
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});