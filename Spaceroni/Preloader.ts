module Spaceroni {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

            //preloader sprite
            this.preloadBar = this.add.sprite(this.game.camera.width / 2 - 200, this.game.camera.height / 2, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //game assets
            this.load.image('player', 'ship.png');
            this.load.image('missile', 'missile.png');
            this.load.image('laser', 'laser.png');
            this.load.image('arrow', 'arrow.png');
            this.load.image('logo', 'mainmenu.png');

            //enemy spritesheet from Infiniship
            var sheet = document.getElementById('sheet').getAttribute('src');
            this.load.spritesheet('sheet', sheet, 12, 12, 128, 2, 4);

            //explosion animation
            this.load.spritesheet('explosion', 'explosion.png', 96, 96, 12);

            //background sprite from space-2d
            var bg = document.getElementById('background').getAttribute('src');
            this.load.image('bg', bg);

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