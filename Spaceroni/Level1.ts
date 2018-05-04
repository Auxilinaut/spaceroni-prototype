module Spaceroni {

    declare var aud: any;
    declare var audio_context: any;

    export class Level1 extends Phaser.State {

        background: Phaser.Image;
        music: Phaser.Sound;
        player: Spaceroni.Player;

        logBtn: Phaser.Key;

        enemies: Spaceroni.Enemies;
        enemyInitAmt: number = 3;
        enemyAmt: number = this.enemyInitAmt;
        enemyOnScreen: boolean = false;

        angle: any;
        targetAngle: any;

        indicators: Phaser.Group;
        indicatorSprites: Phaser.Sprite[] = [];

        explosions: Phaser.Group;

        nextEvent: number = 0;
        nextMusicEvent: number = 0;

        score: number = 0;
        highScore: number;
        livesInitAmt: number = 3;
        lives: number = this.livesInitAmt;

        //music gen vars
        stress: number;
        energy: number;

        showGenLog: boolean = false;

        create() {

            this.background = this.game.add.image(0, 0, 'bg');
            this.background.scale.setTo(5.0, 5.0);
            this.background.smoothed = false;

            this.player = new Player(this.game, 2500, 2500);

            this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

            this.enemies = new Enemies(this.game, this.enemyAmt);

            this.highScore = Number(localStorage.getItem('highscore'));

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

            this.stress = 0;
            this.energy = 0;
            aud.adaptPattern(this.stress, this.energy);

            this.logBtn = this.game.input.keyboard.addKey(Phaser.KeyCode.G);
            this.logBtn.onDown.add(this.toggleGenLog, this);

            this.input.onDown.add(this.toggleMusic, this);

        }

        update() {
            
            // collision detection between bullets/enemies, as well as enemy bullets/player
            this.game.physics.arcade.overlap(this.player.weapon.bullets, this.enemies, this.hitEnemy, null, this);
            this.enemies.forEachAlive(function (enm) {
                this.game.physics.arcade.overlap(this.enemies.weapons[this.enemies.getChildIndex(enm)].bullets, this.player, this.hitPlayer, null, this);
            }, this);

            this.enemyOnScreen = false;

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
                    if (enemy.inCamera && Math.abs(delta) < this.game.math.degToRad(3)) {
                        enemy.rotation = this.targetAngle;
                    }
                }

                // they must bounce against one another so as not to clump
                this.game.physics.arcade.collide(enemy, this.enemies);

                // have the enemy move around and shoot, also remove indicator if enemy is on screen
                if (enemy.inCamera) {
                    this.enemyOnScreen = true;
                    if (this.game.time.now > this.nextEvent) {
                        this.enemies.weapons[this.enemies.getChildIndex(enemy)].fire();
                    }
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].visible = false;
                } else { // indicator on if enemy is out of camera (and it's alive)
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].visible = true;
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].rotation = Phaser.Math.angleBetween(enemy.x * 5, enemy.y * 5, this.game.camera.x + this.game.camera.width / 2, this.game.camera.y + this.game.camera.height / 2);
                    this.indicatorSprites[this.enemies.getChildIndex(enemy)].position.setTo(this.game.camera.x*5 + this.game.camera.width*2.5, this.game.camera.y*5 + this.game.camera.height*2.5);
                }

                //move enemy
                this.game.physics.arcade.accelerationFromRotation(enemy.rotation, 20, enemy.body.acceleration);

            }, this);

            // periodically adapt music to higher stress when enemies are on screen
            if (this.game.time.now > this.nextMusicEvent) {
                if (this.enemyOnScreen) {
                    this.stress = 1;
                } else {
                    this.stress = 0;
                }
                this.nextMusicEvent = this.game.time.now + 200;
                aud.adaptPattern(this.stress, this.energy);
            }
            
            this.updateNextEvent();

        }

        render() {
            this.game.debug.text("Lives: " + this.lives, 32, 32);
            this.game.debug.text("Score: " + this.score, 120, 32);
            if (this.highScore != null) {
                this.game.debug.text("High Score: " + this.highScore, 1115, 32);
            }
            if (this.showGenLog) {
                this.game.debug.text("[Music] Stress:" + this.stress, 32, 670);
                this.game.debug.text("[Music] Energy:" + this.energy, 32, 700);
            }
        }

        // collision bullet to enemy
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

            this.score += 1;

            var ratio = this.enemies.countLiving() / this.enemyAmt; //ratio living enemies to total enemies in level
            this.energy = 1 - ratio + (ratio * 0.2) ; //set energy

            if (this.energy > 1) this.energy = 1;

            if (this.enemies.getFirstAlive() == null) {
                this.enemyAmt += this.enemyInitAmt;
                this.lives += 1;

                this.stress = 0;
                this.energy = 0;

                this.game.state.start('Level1');
            }

            //console.log("boom");
        }

        // collision bullet to player
        hitPlayer(bul, plr) {
            var explosion = this.explosions.getFirstExists(false);
            explosion.reset(bul.body.x + bul.body.halfWidth, bul.body.y + bul.body.halfHeight);
            explosion.body.velocity.y = plr.body.velocity.y;
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);


            

            bul.kill();
            
            if (this.player.inCamera) {
                if (this.lives > 1) {
                    this.lives -= 1;
                    this.player.kill();
                    this.player.reset(2500, 2500);
                } else {
                    this.lives -= 1;
                    this.player.kill();
                    console.log("gg");
                }

                if (!this.player.alive) this.gameOver();

                //console.log(this.lives + " more lives");
            }
        }

        // player dead :[
        gameOver() {
            if (this.highScore !== null) {
                if (this.score > this.highScore) {
                    localStorage.setItem('highscore', this.score.toString());
                }
            } else {
                localStorage.setItem('highscore', this.score.toString());
            }

            this.score = 0;
            this.lives = 3;
            this.enemyAmt = this.enemyInitAmt;

            this.game.state.start('MainMenu');
        }

        // random enemy fire interval setter
        updateNextEvent() {
            this.nextEvent = this.game.time.now + (this.game.rnd.between(0,1) * 100);
        }

        // generation log
        toggleGenLog() {
            this.showGenLog = !this.showGenLog;
            // todo: check if log is on, append to file, etc.
        }

        toggleMusic() {
            audio_context.resume();
            aud.togglePlay();
        }

    }

}