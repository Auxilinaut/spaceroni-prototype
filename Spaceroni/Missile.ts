module Spaceroni {

    export class Missile extends Phaser.Weapon {

        constructor(game: Phaser.Game) {

            super(game, game.plugins);
            
            this.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
            this.bulletSpeed = 1500;
            this.fireRate = 20;

        }

        

    }

}