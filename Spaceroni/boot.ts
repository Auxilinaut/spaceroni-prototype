module Spaceroni {

    declare var aud: any;

    export class Boot extends Phaser.State {

        preload() {

            this.load.image('preloadBar', 'loader.png');
            
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

            this.game.scale.setResizeCallback(this.gameResized, this);

        }

        create() {

            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;

            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;

            this.game.onPause.add(this.resumeOrPause, this);
            this.game.onResume.add(this.resumeOrPause, this);

            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
            }
            else {
                //  Same goes for mobile settings.
            }

            this.game.world.setBounds(0, 0, 5000, 5000);
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false);

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.state.start('Preloader', true, false);

        }

        gameResized(manager: Phaser.ScaleManager, bounds: Phaser.Rectangle) {
            var scale = Math.min((window.innerWidth-15) / this.game.width, (window.innerHeight-10) / this.game.height);

            manager.setUserScale(scale, scale, 0, 0);
        }

        resumeOrPause() {
            aud.togglePlay();
        }

    }

}