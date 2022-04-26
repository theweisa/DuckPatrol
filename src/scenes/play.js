class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    create() {
        // this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0, 0);
        this.background = this.add.tileSprite(0, 0, 640, 480, "grass bg").setOrigin(0, 0);

        this.enemy_spawn_rate = 1.5;
        this.enemy_spawn_timer = 0;
        // define ships
        this.ducks = [];
        for (var i = 0; i < this.ducks.length; i++) {
            this.ducks[i].setOrigin(0, 0)
        }

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyL = this.input.keyboard.addKey('L');
        keyA = this.input.keyboard.addKey('A');
        keyD = this.input.keyboard.addKey('D');

        // define score
        this.p1Score = 0;
        this.p2Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#57b100',
            color: '#FFFFFF',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(config.width - 120 - borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.gameOver = false;
        this.game_timer = (game.settings.gameTimer/1000);
        this.timerText = this.add.text(config.width-120, config.height-50, this.game_timer, scoreConfig);

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            let text;
            if (this.p1Score > this.p2Score) 
                text = "PLAYER 1 WINS";
            else if (this.p1Score < this.p2Score) 
                text = "PLAYER 2 WINS";
            else 
                text = "TIE";
            this.add.text(game.config.width/2, game.config.height/2, text, scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.bg_music.pause();
        }, null, this);
        this.players = [
            new Player(this, game.config.width*(1/3), game.config.height-borderUISize-borderPadding, "spin apple", 1).setOrigin(0.5, 0),
            new Player(this, game.config.width*(2/3), game.config.height-borderUISize-borderPadding, "spin peanut", 2).setOrigin(0.5, 0)
        ];
        this.anims.create({
            key: "spin apple",
            frames: this.anims.generateFrameNumbers("spin apple", {start: 0, end: 4, first: 0}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "spin peanut",
            frames: this.anims.generateFrameNumbers("spin peanut", {start: 0, end: 3, first: 0}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "duck walk",
            frames: this.anims.generateFrameNumbers("duck walk", {start: 0, end: 3, first: 0}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "duck fly apple",
            frames: this.anims.generateFrameNumbers("duck fly apple", {start: 0, end: 1, first: 0}),
            frameRate: 4,
            repeat: -1
        })
        this.anims.create({
            key: "duck fly peanut",
            frames: this.anims.generateFrameNumbers("duck fly peanut", {start: 0, end: 1, first: 0}),
            frameRate: 4,
            repeat: -1
        })
        this.bg_music = this.sound.add("bg_music");
        this.bg_music.play();
    }

    update(time, delta) {
        this.background.tilePositionX  -= 2;
        
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.game.sound.stopAll();
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        // this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {
            this.updateTimer(delta);
            this.updateSpawn(time, delta);
            this.updateEnemies(time, delta);
            this.updatePlayer(time, delta);
            this.updateCollision();
        }
    }

    updateTimer(delta) {
        this.game_timer -= (delta/1000);
        if (this.game_timer <= 0) {
            this.game_timer = 0;
        }
        this.timerText.text = Math.ceil(this.game_timer);
    }

    updatePlayer(time, delta) {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].update();
        }
    }

    updateSpawn(time, delta) {
        this.enemy_spawn_timer += delta/1000;
        if (this.enemy_spawn_timer >= this.enemy_spawn_rate) {
            let moveSpeed = Math.random() * (game.settings.maxDuckSpeed-game.settings.minDuckSpeed)+game.settings.minDuckSpeed;
            let random_y = Math.random() * (game.config.height-(borderUISize*2)-100)+borderUISize
            this.enemy_spawn_timer = 0;
            this.enemy_spawn_rate = Math.random() * (game.settings.maxSpawnRate-game.settings.minSpawnRate)+game.settings.minSpawnRate;
            this.ducks.push(new Duck(
                this, game.config.width + borderUISize*6, random_y, 'duck walk', 0, 30, moveSpeed
            ));
        }
    } 

    updateEnemies(time, delta) {
        for (var i=0; i < this.ducks.length; i++) {
            let duck = this.ducks[i];
            duck.update(time, delta);
            // if the x is out of bounds
            if (duck.x <= 0 - duck.width - 200 || duck.x >= config.width + duck.width + 200) {
                this.ducks.splice(i, 1);
            }
        }
    }

    checkCollision(rocket, duck) {
        // simple AABB checking
        return (rocket.isFiring && duck.can_collide &&
            rocket.x < duck.x + duck.width && 
            rocket.x + rocket.width > duck.x && 
            rocket.y < duck.y + duck.height &&
            rocket.height + rocket.y > duck.y);
    }

    flyAway(player, duck) {
        if (player.player == 1) {
            this.p1Score += duck.points;
            this.scoreLeft.text = this.p1Score;    
        }
        else if (player.player == 2) {
            this.p2Score += duck.points;
            this.scoreRight.text = this.p2Score;
        }
        player.reset();
        duck.quack.stop();
        duck.flyAway(player.player);
        let exp = this.sound.add('sfx_explosion');
        exp.setVolume(0.5);
        exp.play();
        
        let sfx = this.sound.add('sfx_fly_away');
        sfx.setRate(1.2);
        sfx.play();
    }

    updateCollision() {
        // check collisions
        for (var i = 0; i < this.ducks.length; i++) {
            for (var j = 0; j < this.players.length; j++) {
                if (this.checkCollision(this.players[j], this.ducks[i])) {
                    this.flyAway(this.players[j], this.ducks[i]);
                }
            }
        }
    }
}
