module Spaceroni {

    export class Enemies extends Phaser.Group {

        constructor(game: Phaser.Game, num: number) {

            super(game, null, 'sheet');

            game.add.existing(this);

            game.physics.arcade.enableBody(this);

            for (var i = 0; i < num; i++) {
                //  This creates a new Phaser.Sprite instance within the group
                //  Random location, random sprites
                this.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'sheet', i);
            }

        }

        update() {
        }

    }

}
