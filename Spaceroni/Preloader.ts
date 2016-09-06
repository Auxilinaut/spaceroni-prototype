module Spaceroni {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //  Load our actual games assets
            this.load.image('titlepage', 'titlepage.jpg');
            this.load.image('logo', 'logo.png');
            this.load.audio('music', 'title.mp3', true);
            this.load.spritesheet('simon', 'simon.png', 58, 96, 5);
            this.load.image('level1', 'level1.png');

            var sheet = document.getElementById('sheet').getAttribute('src');
            this.load.spritesheet('sheet',sheet,12,12,128,4,4)
        }

        create() {

            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);

        }

        startMainMenu() {

            this.game.state.start('MainMenu', true, false);

        }

    }

}