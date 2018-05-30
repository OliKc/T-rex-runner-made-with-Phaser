var game = new Phaser.Game(600, 150, Phaser.AUTO, 'game-container');

game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('load');
