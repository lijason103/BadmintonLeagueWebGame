// Initalize
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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

function preload() {}

function create() {
    var scene = this
    this.socket = io();
    this.socket.on('currentPlayers', players => {
        Object.keys(players).forEach(id => {
            if (players[id].id === this.socket.id) {
                addPlayer(scene, players[id])
            }
        })
    })
}

function update() {}

function addPlayer(scene, player) {
    var graphics = scene.add.graphics(0, 0)
    console.log(player)
    graphics.fillStyle(0xFFFFFF, 1)
    graphics.fillCircle(player.x, player.y, 10)

}

