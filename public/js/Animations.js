class Animations {
    static createAnims(scene) {
        // initialize animations
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 13 }),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: 'jump',
            frames: scene.anims.generateFrameNumbers('player', { start: 14, end: 20 }),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: 'hit',
            frames: scene.anims.generateFrameNumbers('player', { start: 50, end: 60 }),
            frameRate: 10,
            repeat: -1
        })
    }
}