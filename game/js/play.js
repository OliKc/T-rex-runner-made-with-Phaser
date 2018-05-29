var score = 0.0;
var hiScore;

var playState = {

    create: function () {

        //vars
        this.level = 0;
        this.speed = -250.0;
        this.speedFactor = 1.0;
        this.spawnTimer = 0;
        this.jumpTimer = 0;
        this.playerHeight = game.cache.getImage('player').height;
        this.floorHeight = game.cache.getImage('floor').height;
        this.floorWidth = game.cache.getImage('floor').width;

        //p2 engine
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.gravity.y = 1200;
        game.physics.p2.friction = 0;
        game.physics.p2.setBoundsToWorld(false, false, true, true);
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.obstacleCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        //sprites
        this.player = game.add.sprite(30, 127, 'player');
        this.player.animations.add('still', [0], 60, false);
        this.player.animations.add('run', [2, 3], 15, true);
        this.player.animations.add('dead', [5], 60, false);
        this.startFloor = game.add.sprite(0, game.world.height - this.floorHeight, 'floor');

        //groups
        this.floors = game.add.group();
        this.obstacles = game.add.group();

        //player
        game.physics.p2.enable(this.player);
        this.player.enableBody = true;
        this.player.body.fixedRotation = true;
        this.player.body.angularDamping = 0;
        this.player.body.damping = 0;
        this.player.body.clearShapes();
        this.player.body.loadPolygon('physicsData', 'player');
        this.player.body.setCollisionGroup(this.playerCollisionGroup);
        this.player.body.collides(this.obstacleCollisionGroup, this.gameOver, this);

        //start floor
        game.physics.arcade.enable(this.startFloor);
        this.startFloor.body.velocity.x = this.speed * this.speedFactor;
        this.floors.add(this.startFloor);

        //score text
        this.scoreText = game.add.text(game.world.width - 50, 0, '', {
            font: '24px pixel'
        });
        this.hiScoreText = game.add.text(0, 0, '', {
            font: '24px pixel'
        });

        //controls
        this.cursors = game.input.keyboard.createCursorKeys();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //Audio
        this.checkPoint = game.add.audio('checkPoint');
        this.die = game.add.audio('die');
        this.jump = game.add.audio('jump');
    },

    update: function () {

        score += 0.1 * this.speedFactor;

        this.scoreText.text = Math.ceil(score);
        if (hiScore) this.hiScoreText.text = Math.ceil(hiScore);


        this.playerUpdate();

        this.floorUpdate();

        this.obstaclesUpdate();


        //next level
        if (score - this.level >= 100) {
            this.level += 100;

            this.checkPoint.play();

            if (score < 2001) {
                this.speedFactor += 0.1;

                this.floors.forEach(floor =>
                    floor.body.velocity.x = this.speed * this.speedFactor
                );
                this.obstacles.forEach(obst =>
                    obst.body.velocity.x = this.speed * this.speedFactor
                );
            }
        }
    },

    playerUpdate: function () {

        //if touching ground
        if (this.player.body.y + this.playerHeight / 2 >= game.world.height) {

            this.player.animations.play('run')

            if (this.cursors.up.isDown || this.spaceKey.isDown) {

                this.jumpTimer++;
                if (this.jumpTimer > 3) {

                    this.player.body.velocity.y = -440; //high jump
                    this.player.animations.play('still');
                    this.jump.play();
                }
            } else if (this.jumpTimer > 0 && this.jumpTimer <= 3) {

                this.player.body.velocity.y = -360; //short jump
                this.player.animations.play('still');
                this.jump.play();
                this.jumpTimer = 0;
            }
        } else if (this.cursors.up.isUp && this.spaceKey.isUp) {
            this.jumpTimer = 0;
        }
    },

    floorUpdate: function () {

        let fChild = this.floors.getChildAt(0);

        //adding floor
        if (fChild.x + this.floorWidth <= game.world.width && this.floors.children.length == 1)
            this.makeFloor();

        //removing floor
        if (fChild.x < -this.floorWidth)
            fChild.destroy();
    },

    obstaclesUpdate: function () {

        //adding obstacle
        if (score - this.spawnTimer > (game.rnd.frac() * 0.4 + 4.5) * this.speedFactor) {

            let rand = game.rnd.integerInRange(1, 9);
            if (rand % 2 == 1) //55.6%
                this.makeObstacle();

            this.spawnTimer = Math.ceil(score);
        }

        //removing obstacle
        if (this.obstacles.children.length > 0) {

            let fChild = this.obstacles.getChildAt(0);
            if (fChild.x < -35) fChild.destroy();
        }
    },

    makeFloor: function () {

        let floor = game.add.sprite(game.world.width, game.world.height - this.floorHeight, 'floor');

        game.physics.arcade.enable(floor);
        floor.body.velocity.x = this.speed * this.speedFactor;

        this.floors.add(floor);
    },

    makeObstacle: function () {

        let obstType = game.rnd.integerInRange(1, 1);
        let obstName = 'obst'.concat(obstType);
        let obstHeight = game.cache.getImage(obstName).height;
        let obst = game.add.sprite(game.world.width + 35, game.world.height - obstHeight / 2, obstName);

        game.physics.p2.enable(obst, true);
        obst.enableBody = true;
        obst.body.fixedRotation = true;
        obst.body.angularDamping = 0;
        obst.body.damping = 0;
        obst.body.clearShapes();
        obst.body.loadPolygon('physicsData', obstName);
        obst.body.setCollisionGroup(this.obstacleCollisionGroup);
        obst.body.collides(this.playerCollisionGroup);
        obst.body.velocity.x = this.speed * this.speedFactor;

        this.obstacles.add(obst);
    },

    gameOver: function () {

        this.player.animations.stop();
        this.player.animations.play('dead');
        this.die.play();

        let text = game.add.text(game.world.width / 2, game.world.height / 4, 'G A M E  O V E R', {
            font: '24px pixel'
        });
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;

        let currScore = Math.ceil(score);
        if (currScore > hiScore)
            hiScore = currScore;

        game.paused = true;

    }
};
