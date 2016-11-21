module Spaceroni {

    export class Player extends Phaser.Sprite {

        cursors: Phaser.CursorKeys;
        weapon: Missile;
        fireButton: any;

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'player');

            this.anchor.setTo(0.5, 0.5);

            game.add.existing(this);
            this.weapon = game.add.weapon(30, 'laser');

            this.cursors = game.input.keyboard.createCursorKeys();
            this.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

            game.physics.arcade.enable(this);

            this.body = new Phaser.Physics.Arcade.Body(this);
            this.body.drag.set(100);
            this.body.maxVelocity.set(200);

            //  Tell the weapon to track the player with no offsets from the position
            //  The 'true' argument tells the weapon to track sprite rotation
            this.weapon.trackSprite(this, 0, 0, true);
            this.weapon.bulletAngleOffset = 90;
            this.weapon
        }

        update() {

            if (this.cursors.up.isDown) {
                this.game.physics.arcade.accelerationFromRotation(this.rotation, 300, this.body.acceleration);
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