// Setup connections
var express = require('express');
var app = express();
var server = require('http').Server(app);
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io').listen(server);

var players = {}
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500
const GROUND_Y = 400
const GROUND_X_LEFT_BOUND = 50
const GROUND_X_RIGHT_BOUND = CANVAS_WIDTH - GROUND_X_LEFT_BOUND
const VELOCITY = 300

io.on('connection', function (socket) {
  console.log(`User Connected: ${socket.id}`)
  
  // Manage players
  var isRedAssigned = false
  var isBlueAssigned = false
  for (var key in players) {
    if (players.hasOwnProperty(key)) {
      var player = players[key]
      if (player.team === 'red') isRedAssigned = true
      if (player.team === 'blue') isBlueAssigned = true
    }
  }

  var team
  var x
  if (!isRedAssigned) {
    team = 'red'
    x = (GROUND_X_LEFT_BOUND + CANVAS_WIDTH/2) / 2
  } else if (!isBlueAssigned) {
    team = 'blue'
    x = (CANVAS_WIDTH/2 + GROUND_X_RIGHT_BOUND) / 2
  } else {
    team = 'spectate'
    x = 0
  }

  players[socket.id] = {
    x: x,
    y: GROUND_Y,
    id: socket.id,
    team,
  }

  socket.emit('currentPlayers', players)
  // Tell existing players about the new player
  socket.broadcast.emit('newPlayer', players[socket.id])

  // Handle player disconnect
  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`)
    delete players[socket.id]
    io.emit('disconnect', socket.id)
  });

  // Handle player movement
  // TODO: physics detection at server-side but it's okay for now
  socket.on('player_move_right', (data) => {
    io.emit('player_move_right', players[socket.id])
  })
  socket.on('player_move_left', (data) => {
    io.emit('player_move_left', players[socket.id])
  })
  socket.on('player_move_stand', (data) => {
    io.emit('player_move_stand', players[socket.id])
  })
  socket.on('player_move_jump', (data) => {
    io.emit('player_move_jump', players[socket.id])
  })
  socket.on('sync_player', (data) => {
    data.id = socket.id
    io.emit('sync_player', data)
  })

});

server.listen(8081, () => {
  console.log(`Listening on ${server.address().port}`);
});
