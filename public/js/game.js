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
        gravity: { y: 0 }
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
    this.load.image('floor', 'assets/floor.png')
}

function create() {
    var scene = this
    var width = this.game.config.width
    var height = this.game.config.height
    // set background
    const FLOOR_OFFSET_Y = 100
    this.floor = scene.add.image(width/2, height - FLOOR_OFFSET_Y, 'floor').setDisplaySize(width, FLOOR_OFFSET_Y)

    this.socket = io();
    this.socket.on('currentPlayers', players => {
        console.log(players)
        Object.keys(players).forEach(id => {
            // if (players[id].id === this.socket.id) {
                addPlayer(scene, players[id])
            // }
        })
    })
}

function update() {}

function addPlayer(scene, player) {
    console.log(player)
    var graphics = scene.add.graphics(0, 0)
    graphics.fillStyle(0xFFFFFF, 1)
    graphics.fillCircle(player.x, player.y, 10)
}

