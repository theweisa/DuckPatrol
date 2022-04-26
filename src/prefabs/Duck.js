class Duck extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, moveSpeed) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.anims.play("duck walk");
        
        this.scaleX = 1.5;
        this.scaleY = 1.5;
        this.points = pointValue;
        this.moveSpeed = moveSpeed;
        this.quack = scene.sound.add("sfx_quacking");
        this.quack.setVolume(0.7);
        this.quack.play();
        this.can_collide = true;
        this.turnCounter = 120;
        this.maxCountdown = 120;
    }
    flyAway(player) {
        this.can_collide = false;
        this.quack.pause();
        if (player == 1)
            this.anims.play("duck fly apple");
        else if (player == 2)
            this.anims.play("duck fly peanut");
    }
    update() {
        this.turnCounter -= 1;
        if (this.turnCounter <= 0){
            this.moveSpeed *= -1;
            this.turnCounter = this.maxCountdown * 1.5;
        }
        if (this.can_collide)
            this.x -= this.moveSpeed;
        else {
            this.x += 2;
            this.y -= 2;
        }
    }
}
