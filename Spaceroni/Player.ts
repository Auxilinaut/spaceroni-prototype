module Spaceroni {

    export class Player extends Phaser.Sprite {

        cursors: Phaser.CursorKeys;
        weapon: Phaser.Weapon; //add Spaceroni.Missile
        fireButton: any;

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'player');

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);

            this.cursors = game.input.keyboard.createCursorKeys();
            this.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

            game.physics.arcade.enable(this);

            this.body = new Phaser.Physics.Arcade.Body(this);
            this.body.drag.set(100);
            this.body.maxVelocity.set(300);
            this.body.collideWorldBounds = true;

            this.scale.set(.8, .8);
            
            this.weapon = game.add.weapon(30, 'missile');
            
            this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
            this.weapon.bulletLifespan = 3000;
            this.weapon.bulletSpeed = 500;
            this.weapon.fireRate = 300;
            this.weapon.trackSprite(this, 75, 0, true);
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