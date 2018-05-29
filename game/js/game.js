var game = new Phaser.Game(600, 150, Phaser.AUTO);

game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('score', scoreState);

game.state.start('load');
