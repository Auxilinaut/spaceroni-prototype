module Spaceroni {

    export class Enemies extends Phaser.Group {

        constructor(game: Phaser.Game) {

            super(game, null, 'sheet');

            game.add.existing(this);

            this.game.physics.arcade.enableBody(this);

            for (var i = 0; i < 16; i++) {
                //  This creates a new Phaser.Sprite instance within the group

                this.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'sheet', i);
            }

        }

        update() {
        }

    }

}
