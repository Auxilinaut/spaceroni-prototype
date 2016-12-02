module Spaceroni {

    export class Enemies extends Phaser.Group {

        constructor(game: Phaser.Game, num: number) {

            super(game, null, 'sheet');

            game.add.existing(this);

            // set physics
            this.enableBody = true;
            this.physicsBodyType = Phaser.Physics.ARCADE;

            for (var i = 0; i < num; i++) {
                //  This creates new Phaser.Sprite instances within the group
                //  Random location, random sprites
                this.create(Math.random() * 960, Math.random() * 960, 'sheet', i);
            }

            this.scale.set(4, 4);

        }

    }

}
