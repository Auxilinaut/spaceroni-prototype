module Spaceroni {

    export class MainMenu extends Phaser.State {

        background: Phaser.Image;
        logo: Phaser.Sprite;
        highScore: number;
        
        init() {

            this.highScore = localStorage.getItem('highscore');
            this.background = this.game.add.image(0, 0, 'bg');
            
            this.background.alpha = 0;

            this.logo = this.add.sprite(this.game.camera.width / 2, this.game.camera.height / 2-300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);

            this.add.tween(this.background).to({ alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: this.game.camera.height/2 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);


            this.input.onDown.addOnce(this.fadeOut, this);
            

        }

        render() {
            if (this.highScore !== null) {
                this.game.debug.text("High Score: " + this.highScore, 1115, 32);
            }
            this.game.debug.text("Arrows to move, Spacebar to shoot. Click to start.", 32, 700);
        }

        fadeOut() {

            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);

            tween.onComplete.add(function () { this.game.state.start('Level1'); }, this);

        }

    }

}