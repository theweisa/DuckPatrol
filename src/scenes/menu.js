class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image("starfield", "./assets/starfield.png");
        this.load.image("grass bg", "./assets/grass_bg.png");
        this.load.spritesheet("spin apple", "./assets/spin_apple.png", {frameWidth: 24, frameHeight: 24, startFrame: 0, endFrame: 4});
        this.load.spritesheet("spin peanut", "./assets/peanut.png", {frameWidth: 24, frameHeight: 24, startFrame: 0, endFrame: 3});
        this.load.spritesheet("duck walk", "./assets/duck_walk.png", {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 3});
        this.load.spritesheet("duck fly apple", "./assets/duck_fly_apple.png", {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 1});
        this.load.spritesheet("duck fly peanut", "./assets/duck_fly_peanut.png", {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 1});

        // load audio
        this.load.audio("sfx_quacking", "./assets/Sounds/Duck-quack.mp3");
        this.load.audio("sfx_fly_away", "./assets/Sounds/wing_beat.wav");
        this.load.audio('sfx_select', "./assets/Sounds/blip_select12.wav");
        this.load.audio('sfx_explosion', './assets/Sounds/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/Sounds/throw.wav');
        this.load.audio('bg_music', './assets/Sounds/you_see_big_girl.mp3')

        // credit to 8-bit universe 
        // https://www.youtube.com/watch?v=B2oSSoNcvdc&ab_channel=8BitUniverse
        this.load.audio('duck_song', './assets/Sounds/duck_song.mp3');
    }

    create() {
        this.add.tileSprite(0, 0, 640, 480, "grass bg").setOrigin(0, 0);
        let menuConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(game.config.width/2, game.config.height/2-borderUISize-borderPadding, "DUCK PATROL", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "P1: arrows <--> to move & (F) to fire", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2+borderUISize+borderPadding, "P2: keys A<-->D to move & (L) to fire", menuConfig).setOrigin(0.5);
        menuConfig.color = "#000";
        this.add.text(game.config.width/2, game.config.height/2+2*(borderUISize+borderPadding), "Press <- for Novice or -> for Expert", menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.duck_song = this.sound.add('duck_song');
        this.duck_song.setVolume(0.5);
        this.duck_song.setLoop(true);
        this.duck_song.play();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            minDuckSpeed: 1,
            maxDuckSpeed: 2,
            minSpawnRate: 1,
            maxSpawnRate: 2,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.duck_song.stop();
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            minDuckSpeed: 2,
            maxDuckSpeed: 4,
            minSpawnRate: 0.5,
            maxSpawnRate: 1.5,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.duck_song.stop();
          this.scene.start('playScene');    
        }
      }
}