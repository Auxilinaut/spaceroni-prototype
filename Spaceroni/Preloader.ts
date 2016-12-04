module Spaceroni {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

            //preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //game assets
            this.load.image('player', 'ship.png');
            this.load.image('debug', 'debug-grid-1920x1920.png');
            this.load.image('missile', 'missile.png');
            this.load.image('laser', 'laser.png');
            this.load.image('arrow', 'arrow.png');

            //enemies
            var sheet = document.getElementById('sheet').getAttribute('src');
            this.load.spritesheet('sheet', sheet, 12, 12, 128, 2, 4);
        }

        create() {

            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);

            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        }

        startMainMenu() {

            this.game.state.start('MainMenu', true, false);

        }

    }

}