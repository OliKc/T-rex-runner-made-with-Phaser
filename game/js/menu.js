var menuState = {

    create: function () {
        game.add.text(100, 100, 'Press spacebar to start...');

        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.startGame, this);

        this.player = game.add.sprite(30, 127, 'player');
        this.player.anchor.x = 0.5;
        this.player.anchor.y = 0.5;
    },

    startGame: function () {
        game.state.start('play');
    }
};
