// TODO: extends Phaser.Physics.Arcade.Sprite
class Player {
    constructor(scene, x, y, id) {
        this.x = x
        this.y = y
        this.id = id
        this.velocity = 150
        this.sprite = scene.physics.add.sprite(x, y, 'player')
        this.sprite.setScale(2)
        this.sprite.setBounce(0.2)
        this.sprite.setCollideWorldBounds(true)
    }

    moveLeft(scene) {
        this.sprite.flipX = true
        this.sprite.body.setVelocityX(-this.velocity)
        this.playAnimation(scene, 'walk')
    }

    moveRight(scene) {
        this.sprite.flipX = false
        this.sprite.body.setVelocityX(this.velocity)
        this.playAnimation(scene, 'walk')
    }

    jump(scene) {
        this.sprite.body.setVelocityY(this.velocity)
    }

    stand(scene) {
        this.sprite.body.setVelocityX(0)
        this.playAnimation(scene, 'idle')
    }

    playAnimation(scene, key) {
        if (this.getCurrentAnimKey() !== key) {
            scene.anims.play(key, this.sprite)
        }
    }

    getCurrentAnimKey() {
        if (!this.sprite.anims.currentAnim) {
            return null
        }
        return this.sprite.anims.currentAnim.key
    }

}