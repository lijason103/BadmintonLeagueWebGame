// Initalize
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 500,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 700 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    } 
};

var game = new Phaser.Game(config);

function preload() {
    this.players = []   // other players
    this.player = null  // my player
    this.load.image('floor', 'assets/floor.png')
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 50, frameHeight: 37 })
}

function create() {
    var scene = this
    var width = scene.game.config.width
    var height = scene.game.config.height
    // set background
    const FLOOR_OFFSET_Y = 100
    scene.floor = scene.add.image(width/2, height - FLOOR_OFFSET_Y, 'floor').setDisplaySize(width, FLOOR_OFFSET_Y)
    scene.physics.world.bounds.width = width
    scene.physics.world.bounds.height = height - FLOOR_OFFSET_Y

    // initialize animations
    Animations.createAnims(scene)

    // initialize socket
    scene.socket = io();
    scene.socket.on('currentPlayers', players => {
        Object.keys(players).forEach(id => {
            var player = players[id]
            var sprite = new Player(scene, player.x, player.y, player.id)
            if (player.id === scene.socket.id) {
                console.log("My ID: ", scene.socket.id)
            }
            scene.players.push(sprite)
        })
    })
    scene.socket.on('newPlayer', player => {
        console.log("New Player: ", player)
        var sprite = new Player(scene, player.x, player.y, player.id)
        scene.players.push(sprite)
    })
    scene.socket.on('disconnect', id => {
        console.log("Disconnected: ", id)
        var index = findPlayerIndexWithId(scene.players, id)
        if (index > -1) {
            console.log('Deleting player: ', player)
            var player = scene.players[index]
            player.destroy()
            scene.players.splice(index, 1)
        }
    })

    // Update other players
    scene.socket.on('player_move_right', nPlayer => {
        updatePlayer(scene, nPlayer.id, player => player.moveRight(scene))
    })
    scene.socket.on('player_move_left', nPlayer => {
        updatePlayer(scene, nPlayer.id, player => player.moveLeft(scene))
    })
    scene.socket.on('player_move_stand', nPlayer => {
        updatePlayer(scene, nPlayer.id, player => player.stand(scene))
    })
    scene.socket.on('player_move_jump', nPlayer => {
        updatePlayer(scene, nPlayer.id, player => player.jump(scene))
    })
    scene.socket.on('sync_player', nPlayer => {
        updatePlayer(scene, nPlayer.id, player => player.forceUpdate(nPlayer.x, nPlayer.y))
    })
    scene.inputs = new Inputs(scene)
}

function updatePlayer(scene, id, callback) {
    var index = findPlayerIndexWithId(scene.players, id)
    if (index > -1) {
        var player = scene.players[index]
        callback(player)
    }
}

function update(time, delta) {
    var scene = this

    // TODO: this is bad. it should be handled by server but cheating is not
    // a concern in this mini game
    if (!scene.syncTimer || time - scene.syncTimer > 100) {
        scene.syncTimer = time
        var player = scene.players[findPlayerIndexWithId(scene.players, scene.socket.id)]
        if (player) {
            scene.socket.emit('sync_player', player.getPosition())
        }
    }

    if (scene.inputs.getIsRightDown()) {
        scene.socket.emit('player_move_right')
    } else if (scene.inputs.getIsLeftDown()) {
        scene.socket.emit('player_move_left')
    } else {
        scene.socket.emit('player_move_stand')
    }

    if (scene.inputs.getIsUpDown()) {
        scene.socket.emit('player_move_jump')
    }

    scene.players.forEach(player => {
        // player.stand(scene)
    })
}


function findPlayerIndexWithId(players, id) {
    for (let i = 0; i < players.length; ++i) {
        if (players[i].getId() === id) {
            return i
        }
    }
    return -1
}