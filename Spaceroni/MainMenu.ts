module Spaceroni {

    declare var aud: any;
    declare var audio_context: any;

    export class MainMenu extends Phaser.State {

        background: Phaser.Image;
        logo: Phaser.Sprite;
        highScore: number;

        startButton: Phaser.Key;
        genMusicButton: Phaser.Key;

        //music gen vars
        stress: number = 0;
        energy: number = 0;
        pat: number = 1;
        patLen: number = 16;
        plusOrMinus: number = Math.random() < 0.5 ? -1 : 1;
        seed: number = this.plusOrMinus * Math.random() * Number.MAX_VALUE;

        init() {

            this.highScore = +localStorage.getItem('highscore');
            this.background = this.game.add.image(0, 0, 'bg');
            this.background.scale.setTo(5.0, 5.0);
            this.background.smoothed = false;
            this.background.alpha = 0;
            
            aud.generatePattern(this.stress, this.energy, this.pat, this.patLen, this.seed);

            this.logo = this.add.sprite(this.game.camera.width / 2, this.game.camera.height / 2-300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);

            this.add.tween(this.background).to({ alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: this.game.camera.height/2 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);

            this.startButton = this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
            this.startButton.onDown.addOnce(this.fadeOut, this);

            this.genMusicButton = this.game.input.keyboard.addKey(Phaser.KeyCode.M);
            this.genMusicButton.onDown.add(this.regenMusic, this);

            this.input.onDown.add(this.toggleMusic, this);
        }

        render() {
            if (this.highScore !== null || this.highScore == 0) {
                this.game.debug.text("High Score: " + this.highScore, 1115, 32);
            }
            this.game.debug.text("In-game: ARROWS to move. SPACEBAR to shoot.", 20, 640);
            this.game.debug.text("CLICK to toggle music.", 20, 670);
            this.game.debug.text("Menu: M to regenerate music. ENTER to start.", 20, 700);
        }

        toggleMusic() {
            audio_context.resume();
            aud.togglePlay();
        }

        regenMusic() {
            this.plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            this.seed = this.plusOrMinus * Math.random() * Number.MAX_VALUE;
            aud.generatePattern(this.stress, this.energy, this.pat, this.patLen, this.seed);
            aud.togglePlay();
        }

        fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
            var newImage = this.game.add.image(0, 0, cacheKey);
            newImage.scale.set(2);
        }

        fadeOut() {

            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);

            tween.onComplete.add(function () { this.game.state.start('Level1'); }, this);

        }

    }

}