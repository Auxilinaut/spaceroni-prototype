module Spaceroni {

    export class Player extends Phaser.Sprite {

        cursors: Phaser.CursorKeys;

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'simon', 0);

            this.anchor.setTo(0.5, 0);

            this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);

            game.add.existing(this);

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.game.physics.p2.enable(this);
            this.body.fixedRotation = true;
        }

        update() {
            
            this.body.setZeroVelocity();

            if (this.cursors.left.isDown) {

                this.body.velocity.x = -150;
                this.animations.play('walk');

                if (this.scale.x == 1) {
                    this.scale.x = -1;
                }
            }
            else if (this.cursors.right.isDown) {

                this.body.velocity.x = 150;
                this.animations.play('walk');

                if (this.scale.x == -1) {
                    this.scale.x = 1;
                }
            }
            else {
                this.animations.frame = 0;
            }

            if (this.cursors.up.isDown) {
                this.body.moveUp(300)
            }
            else if (this.cursors.down.isDown) {
                this.body.moveDown(300);
            }
        }
            
    }

}