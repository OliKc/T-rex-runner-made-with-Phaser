var loadState = {

    preload: function () {

        game.load.spritesheet('player', 'game/assets/sprites/t_rex.png', 44, 47, 6);
        game.load.image('floor', 'game/assets/sprites/ground.png');
        game.load.image('retry', 'game/assets/sprites/retry.png');
        game.load.image('obst1', 'game/assets/sprites/obstacles/big_barrel.png');
        game.load.image('obst2', 'game/assets/sprites/obstacles/med_barrel.png');
        game.load.image('obst3', 'game/assets/sprites/obstacles/cactus_0.png');
        game.load.image('obst4', 'game/assets/sprites/obstacles/cactus_1.png');
        game.load.image('obst5', 'game/assets/sprites/obstacles/cactus_2.png');
        //game.load.image('ob4', 'game/assets/Obstacle4.png');
        //game.load.image('sky', 'game/assets/Sky.png');


        game.load.physics('physicsData', 'game/assets/physics/sprites.json');

        game.load.audio('checkPoint', 'game/assets/audio/checkPoint.mp3');
        game.load.audio('die', 'game/assets/audio/die.mp3');
        game.load.audio('jump', 'game/assets/audio/jump.mp3');
    },

    create: function () {

        //sound activation override
        if (game.sound.usingWebAudio &&
            game.sound.context.state === 'suspended') {
            game.input.onTap.addOnce(game.sound.context.resume, game.sound.context);
        }

        //initializing physics systems
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.startSystem(Phaser.Physics.P2JS);

        game.stage.backgroundColor = '#fff';

        game.state.start('menu');
    }
};
