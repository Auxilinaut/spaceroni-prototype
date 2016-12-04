module Spaceroni {

    export class Level1 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Spaceroni.Player;
        enemies: Spaceroni.Enemies;
        
        angle: any;
        targetAngle: any;
        enemyAmt = 5;

        indicators: Phaser.Group;
        indicatorSprites: Phaser.Sprite[] = [];

        create() {
            
            this.game.add.tileSprite(0, 0, 1920, 1920, 'debug');
            
            this.player = new Player(this.game, 960, 960);

            this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            this.enemies = new Enemies(this.game, this.enemyAmt);
            this.indicators = this.game.add.group();
            for (var i = 0; i < this.enemyAmt;i++){
                this.indicatorSprites[i] = this.indicators.create(0, 0, 'arrow');
                this.indicatorSprites[i].pivot.x = 345;
                this.indicatorSprites[i].pivot.y = 0;
                this.indicatorSprites[i].anchor.set(0.5);
            }

            this.game.physics.arcade.enable(this.indicators);

        }

        update() {

            // collision detection between bullets/enemies
            this.game.physics.arcade.overlap(this.player.weapon.bullets, this.enemies, this.hitEnemy, null, this);
            
            this.enemies.forEachAlive(function (enemy: Phaser.Sprite) {

                // Calculate the angle from the enemy to the player.x and player.y
                this.targetAngle = this.game.math.angleBetween(
                    enemy.x*6, enemy.y*6,
                    this.player.x, this.player.y
                );

                // Gradually aim the missile towards the target angle
                if (enemy.rotation != this.targetAngle) {
                    // Calculate difference between the current angle and targetAngle
                    var delta = this.targetAngle - enemy.rotation;

                    // Keep it in range from -180 to 180 to make the most efficient turns.
                    if (delta > Math.PI) delta -= Math.PI * 2;
                    if (delta < -Math.PI) delta += Math.PI * 2;

                    if (delta > 0) {
                        // Turn clockwise
                        enemy.angle += 3;
                    } else {
                        // Turn counter-clockwise
                        enemy.angle -= 3;
                    }

                    // Just set angle to target angle if they are close
                    if (Math.abs(delta) < this.game.math.degToRad(3) && enemy.inCamera) {
                        enemy.rotation = this.targetAngle;
                    }
                }

                // they must hit one another so as not to clump
                this.game.physics.arcade.collide(enemy, this.enemies);

                //enemy.body.velocity.setTo(0, 0);
                


                if (enemy.inCamera) {
                    this.game.physics.arcade.accelerationFromRotation(enemy.rotation, 20, enemy.body.acceleration);
                    this.enemies.weapons[this.enemies.getChildIndex(enemy)].fire();
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].visible = false;
                } else {
                    //this.indicators.getChildAt(this.enemies.getChildIndex(enemy)).pivot.x = 200;
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].visible = true;
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].rotation = Phaser.Math.angleBetween(enemy.x * 6, enemy.y * 6, this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2);
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].position.setTo(this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2);
                    //this.game.physics.arcade.accelerationFromRotation(enemy.rotation, 1, enemy.body.acceleration);
                }

            }, this);
            
            

        }

        render() {
            /*this.game.debug.cameraInfo(this.game.camera, 32, 10);
            this.game.debug.text(this.angle, 32, 32);
            this.game.debug.text(this.targetAngle, 32, 50);
            
            this.enemies.forEachAlive(function (enemy: Phaser.Sprite) {
                this.game.debug.spriteInfo(enemy, 32, (this.enemies.getChildIndex(enemy)+1)*85);
            }, this);

            this.game.debug.spriteInfo(this.indicator, 32, 510);
            this.game.debug.spriteInfo(this.player, 32, 600);*/

        }

        hitEnemy(bul, enm) {

            /*
            var explosion = explosions.getFirstExists(false);
            explosion.reset(Bullet.body.x + Bullet.body.halfWidth, Bullet.body.y + Bullet.body.halfHeight);
            explosion.body.velocity.y = enemy.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);
            */

            bul.kill();

            enm.kill();

            console.log("boom");
        }

    }

}