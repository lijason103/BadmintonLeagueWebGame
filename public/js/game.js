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
                scene.player = sprite
                console.log("My ID: ", scene.socket.id)
            } else {
                scene.players.push(sprite)
            }
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

    scene.inputs = new Inputs(scene)
}

function update() {
    var scene = this
    if (scene.player) {
        if (scene.inputs.getIsRightDown()) {
            scene.player.moveRight(scene)
        } else if (scene.inputs.getIsLeftDown()) {
            scene.player.moveLeft(scene)
        } else {
            scene.player.stand(scene)
        }

        if (scene.inputs.getIsUpDown()) {
            scene.player.jump(scene)
        }
    }

    scene.players.forEach(player => {
        player.stand(scene)
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