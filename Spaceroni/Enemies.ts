module Spaceroni {

    export class Enemies extends Phaser.Group {

        weapons: Phaser.Weapon[] = [];
        enemySprites: Phaser.Sprite[] = [];
        num: number;
        debugText: string;

        constructor(game: Phaser.Game, num: number) {

            super(game, null, 'sheet');

            game.add.existing(this);

            this.num = num;

            // set physics for group
            this.enableBody = true;
            this.physicsBodyType = Phaser.Physics.ARCADE;

            for (var i = 0; i < num; i++) {
                //  This creates new Phaser.Sprite instances within the group
                //  Random location in world, random sprites from Infiniship
                this.enemySprites[i] = this.create(Math.random() * 320, Math.random() * 320, 'sheet', i);

                // physics per Sprite
                this.enemySprites[i].body.collideWorldBounds = true;
                this.enemySprites[i].body.drag.setTo(20);
                this.enemySprites[i].body.maxVelocity.setTo(50);
                this.enemySprites[i].body.bounce.setTo(200, 200);
                this.enemySprites[i].anchor.setTo(0.5, 0.5);
                this.enemySprites[i].smoothed = false;

                // add weapon for each
                this.weapons.push(game.add.weapon(5, 'laser'));

                this.weapons[i].bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
                this.weapons[i].bulletLifespan = 3000;
                this.weapons[i].bulletSpeed = 600;
                this.weapons[i].fireRate = 2000;
                this.weapons[i].trackSprite(this.enemySprites[i], 50, 0, true);
            }

            // scale affects world x/y location
            this.scale.set(6, 6);

        }

    }

}
