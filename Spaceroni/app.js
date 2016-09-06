window.onload = function () {
    var game = new Spaceroni.Game();
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Spaceroni;
(function (Spaceroni) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'loader.png');
        };
        Boot.prototype.create = function () {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
            }
            else {
            }
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    }(Phaser.State));
    Spaceroni.Boot = Boot;
})(Spaceroni || (Spaceroni = {}));
var Spaceroni;
(function (Spaceroni) {
    var Enemies = (function (_super) {
        __extends(Enemies, _super);
        function Enemies(game) {
            _super.call(this, game, null, 'sheet');
            game.add.existing(this);
            this.game.physics.arcade.enableBody(this);
            for (var i = 0; i < 16; i++) {
                //  This creates a new Phaser.Sprite instance within the group
                this.create(360 + Math.random() * 200, 120 + Math.random() * 200, 'sheet', i);
            }
        }
        Enemies.prototype.update = function () {
        };
        return Enemies;
    }(Phaser.Group));
    Spaceroni.Enemies = Enemies;
})(Spaceroni || (Spaceroni = {}));
var Spaceroni;
(function (Spaceroni) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', Spaceroni.Boot, false);
            this.state.add('Preloader', Spaceroni.Preloader, false);
            this.state.add('MainMenu', Spaceroni.MainMenu, false);
            this.state.add('Level1', Spaceroni.Level1, false);
            this.state.start('Boot');
        }
        return Game;
    }(Phaser.Game));
    Spaceroni.Game = Game;
})(Spaceroni || (Spaceroni = {}));
var Spaceroni;
(function (Spaceroni) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
        Level1.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'level1');
            this.music = this.add.audio('music', 1, false);
            //this.music.play();
            this.player = new Spaceroni.Player(this.game, 130, 284);
            this.enemies = new Spaceroni.Enemies(this.game);
        };
        return Level1;
    }(Phaser.State));
    Spaceroni.Level1 = Level1;
})(Spaceroni || (Spaceroni = {}));
var Spaceroni;
(function (Spaceroni) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;
            this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            this.logo.anchor.setTo(0.5, 0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);
            this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            this.input.onDown.addOnce(this.fadeOut, this);
        };
        MainMenu.prototype.fadeOut = function () {
            this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };
        MainMenu.prototype.startGame = function () {
            this.game.state.start('Level1', true, false);
        };
        return MainMenu;
    }(Phaser.State));
    Spaceroni.MainMenu = MainMenu;
})(Spaceroni || (Spaceroni = {}));
var Spaceroni;
(function (Spaceroni) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'simon', 0);
            this.anchor.setTo(0.5, 0);
            this.animations.add('walk', [0, 1, 2, 3, 4], 10, true);
            game.add.existing(this);
            this.game.physics.arcade.enableBody(this);
        }
        Player.prototype.update = function () {
            this.body.velocity.x = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -150;
                this.animations.play('walk');
                if (this.scale.x == 1) {
                    this.scale.x = -1;
                }
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 150;
                this.animations.play('walk');
                if (this.scale.x == -1) {
                    this.scale.x = 1;
                }
            }
            else {
                this.animations.frame = 0;
            }
        };
        return Player;
    }(Phaser.Sprite));
    Spaceroni.Player = Player;
})(Spaceroni || (Spaceroni = {}));
var Spaceroni;
(function (Spaceroni) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
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
            this.load.spritesheet('sheet', sheet, 12, 12, 128, 4, 4);
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };
        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    }(Phaser.State));
    Spaceroni.Preloader = Preloader;
})(Spaceroni || (Spaceroni = {}));
