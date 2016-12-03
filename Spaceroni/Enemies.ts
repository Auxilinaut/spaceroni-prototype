module Spaceroni {

    export class Enemies extends Phaser.Group {

        weapons: Phaser.Weapon[] = [];
        enemy: Phaser.Sprite;
        num: number;

        constructor(game: Phaser.Game, num: number) {

            super(game, null, 'sheet');

            game.add.existing(this);

            this.num = num;

            // set physics
            this.enableBody = true;
            this.physicsBodyType = Phaser.Physics.ARCADE;

            

            for (var i = 0; i < num; i++) {
                //  This creates new Phaser.Sprite instances within the group
                //  Random location in world, random sprites from Infiniship
                this.enemy = this.create(Math.random() * 480, Math.random() * 480, 'sheet', i);

                // add weapon for each
                this.weapons.push(game.add.weapon(5, 'laser'));

                this.weapons[i].bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
                this.weapons[i].bulletLifespan = 3000;
                this.weapons[i].bulletSpeed = 500;
                this.weapons[i].fireRate = 500;
                this.weapons[i].trackSprite(this.enemy, 75, 0, true);
            }

            // scale affects world x/y location
            this.scale.set(4, 4);

        }

        update() {


            for (var i = 0; i < this.num; i++) {
                this.weapons[i].fire();
            }


        }

    }

}
