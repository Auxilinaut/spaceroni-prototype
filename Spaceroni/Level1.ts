module Spaceroni {

    export class Level1 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Spaceroni.Player;
        enemies: Spaceroni.Enemies;
        enemyAmt: number = 10;
        
        angle: any;
        targetAngle: any;

        indicators: Phaser.Group;
        indicatorSprites: Phaser.Sprite[] = [];

        explosions: Phaser.Group;

        nextEvent: number = 0;

        create() {

            this.game.add.image(0, 0, 'bg');
            
            this.player = new Player(this.game, 2500, 2500);

            this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            this.enemies = new Enemies(this.game, this.enemyAmt);

            this.explosions = this.game.add.group();
            this.explosions.enableBody = true;
            this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
            this.explosions.createMultiple(30, 'explosion');
            this.explosions.setAll('anchor.x', 0.5);
            this.explosions.setAll('anchor.y', 0.5);
            this.explosions.forEach(function (explosion: Phaser.Sprite) {
                explosion.animations.add('explosion');
            }, this);


            this.indicators = this.game.add.group();
            this.indicators.scale.set(.2, .2);
            for (var i = 0; i < this.enemyAmt;i++){
                this.indicatorSprites[i] = this.indicators.create(0, 0, 'arrow');
                this.indicatorSprites[i].pivot.x = 1700;
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
                    enemy.x*5, enemy.y*5,
                    this.player.x, this.player.y
                );

                // Gradually aim the enemy toward the target angle
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

                // they must bounce against one another so as not to clump
                this.game.physics.arcade.collide(enemy, this.enemies);

                // have the enemy move around and shoot, also remove indicator if enemy is on screen
                if (enemy.inCamera) {
                    this.game.physics.arcade.accelerationFromRotation(enemy.rotation, 20, enemy.body.acceleration);
                    if (this.game.time.now > this.nextEvent) {
                        this.enemies.weapons[this.enemies.getChildIndex(enemy)].fire();
                    }
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].visible = false;
                } else { // indicator on if enemy is out of camera (if it's alive)
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].visible = true;
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].rotation = Phaser.Math.angleBetween(enemy.x * 5, enemy.y * 5, this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2);
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].position.setTo(this.game.camera.x*5 + this.game.camera.width*2.5, this.game.camera.y*5 + this.game.camera.height*2.5);
                }

            }, this);
            
            this.updateNextEvent();

        }

        render() {
            this.game.debug.text("now: " + this.game.time.now + " next: " + this.nextEvent, 32, 32);
            /*this.game.debug.cameraInfo(this.game.camera, 32, 10);
            
            this.enemies.forEachAlive(function (enemy: Phaser.Sprite) {
                this.game.debug.spriteInfo(enemy, 32, (this.enemies.getChildIndex(enemy)+1)*85);
            }, this);

            this.game.debug.spriteInfo(this.indicator, 32, 510);
            this.game.debug.spriteInfo(this.player, 32, 600);*/

        }

        hitEnemy(bul, enm) {
            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(bul.body.x + bul.body.halfWidth, bul.body.y + bul.body.halfHeight);
            explosion.body.velocity.y = enm.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);
            

            var idx = this.enemies.getChildIndex(enm);

            this.indicators.getChildAt(idx).visible = false;

            bul.kill();

            enm.kill();

            console.log("boom");
        }

        updateNextEvent() {
            this.nextEvent = this.game.time.now + (this.game.rnd.between(0,1) * 100);
        }

    }

}