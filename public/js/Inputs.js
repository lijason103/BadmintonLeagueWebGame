class Inputs {
    constructor(scene) {
        this.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    }

    getIsLeftDown() {
        return this.left.isDown
    }

    getIsRightDown() {
        return this.right.isDown
    }

    getIsDownDown() {
        return this.down.isDown
    }

    getIsUpDown() {
        return this.up.isDown
    }
}