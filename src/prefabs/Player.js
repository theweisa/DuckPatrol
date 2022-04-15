// Rocket prefab
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, anim, player) {
      super(scene, x, y, anim);
  
      // add object to existing scene
      scene.add.existing(this);
      this.isFiring = false;
      this.moveSpeed = 4;
      this.scaleX = 2;
      this.scaleY = 2;
      this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
      this.player = player;
    }

    update() {
        if (!this.isFiring) {
            if (this.player == 2 && keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            }
            else if (this.player == 2 && keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
            else if (this.player == 1 && keyA.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } 
            else if (this.player == 1 && keyD.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }
        if (this.player == 1 && Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.anims.play("spin apple");
            this.sfxRocket.play();  // play sfx
        }
        if (this.player == 2 && Phaser.Input.Keyboard.JustDown(keyL) && !this.isFiring) {
            this.isFiring = true;
            this.anims.play("spin peanut");
            this.sfxRocket.play();  // play sfx
        }
        if (this.isFiring && this.y > 0) {
            this.y -= this.moveSpeed;
        }
        if (this.y <= 0) {
            this.reset();
        }
    }

    reset() {
        if (this.player==1)
            this.anims.play({key: "spin apple", startFrame: 0}, false);
        else if (this.player==2)
            this.anims.play({key: "spin peanut", startFrame: 0}, false);
        this.anims.stop();
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}