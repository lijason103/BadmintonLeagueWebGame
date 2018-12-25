// TODO: extends Phaser.Physics.Arcade.Sprite
class Player {
    constructor(scene, x, y, id) {
        this.id = id
        this.velocity = 300
        this.sprite = scene.physics.add.sprite(x, y, 'player')
        this.sprite.setScale(2)
        this.sprite.setBounce(0)
        this.sprite.setCollideWorldBounds(true)
        this.stand(scene)
    }

    getId() {
        return this.id
    }

    getPosition() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }

    moveLeft(scene) {
        this.sprite.flipX = true
        this.sprite.body.setVelocityX(-this.velocity)
        if (this.getCurrentAnimKey() !== 'walk' && this.sprite.body.onFloor()) {
            scene.anims.play('walk', this.sprite)
        }
    }

    moveRight(scene) {
        this.sprite.flipX = false
        this.sprite.body.setVelocityX(this.velocity)
        if (this.getCurrentAnimKey() !== 'walk' && this.sprite.body.onFloor()) {
            scene.anims.play('walk', this.sprite)
        }
    }

    jump(scene) {
        if (this.sprite.body.onFloor()){
            this.sprite.body.setVelocityY(-this.velocity)
        }
        if (this.getCurrentAnimKey() !== 'jump' && !this.sprite.body.onFloor()) {
            scene.anims.play('jump', this.sprite)
        }
    }

    stand(scene) {
        this.sprite.body.setVelocityX(0)
        if (this.getCurrentAnimKey() !== 'idle' && this.sprite.body.onFloor()) {
            scene.anims.play('idle', this.sprite)
        }
    }

    forceUpdate(x, y) {
        this.sprite.x = x
        this.sprite.y = y
    }

    getCurrentAnimKey() {
        if (!this.sprite.anims.currentAnim) {
            return null
        }
        return this.sprite.anims.currentAnim.key
    }

    destroy() {
        this.sprite.destroy()
    }

}