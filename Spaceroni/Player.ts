module Spaceroni {

    export class Player extends Phaser.Sprite {

        cursors: Phaser.CursorKeys;
        weapon: Phaser.Weapon; //add Spaceroni.Missile
        fireButton: any;
        lives: number = 3;

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'player');

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);

            this.cursors = game.input.keyboard.createCursorKeys();
            this.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

            this.body = new Phaser.Physics.Arcade.Body(this);
            this.body.enable = true;
            this.body.type = Phaser.Physics.ARCADE;
            this.body.drag.set(100);
            this.body.maxVelocity.set(300);
            this.body.collideWorldBounds = true;

            this.scale.set(.6, .6);
            
            this.weapon = game.add.weapon(30, 'missile');
            
            this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            this.weapon.bulletSpeed = 700;
            this.weapon.fireRate = 300;
            this.weapon.trackSprite(this, 55, 0, true);
        }

        update() {

            if (this.cursors.up.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this.rotation, 600, this.body.acceleration);
            }
            else {
                this.body.acceleration.set(0);
            }

            if (this.cursors.left.isDown) {
                this.body.angularVelocity = -300;
            }
            else if (this.cursors.right.isDown) {
                this.body.angularVelocity = 300;
            }
            else {
                this.body.angularVelocity = 0;
            }

            if (this.fireButton.isDown) {
                this.weapon.fire();
            }
        }
            
    }

}