var InsurancePlz = InsurancePlz || {};
var emitter;
/**
 * Prototype responsible for operating the main menu.
 * For now, the only option is to start the game.
 */
InsurancePlz.MenuState = {
    create: function () {
        //Title style
        var titleStyle = {
            color: 'white',
            font: '48px ZrNic',
            fill: '#fff',
            align: 'center',
            wordWrapWidth: 440
        };

        //Menu style
        var menuStyle = {
            color: 'white',
            fill: '#ccc',
            align: 'center',
            wordWrapWidth: 440
        };
        //Play intro (menu) music
        //var music = new Phaser.Sound(this.game, 'menumusic',1,true);
        this.menumusic = this.add.audio('menumusic');
        this.menumusic.loop = true;
        this.menumusic.play();

        //Particle effects backrground
        this.game.stage.backgroundColor = '#000000';
        emitter = this.game.add.emitter(this.game.world.centerX, 500, 200);

        emitter.makeParticles('button'); //the sprite for the particle, is set to button for now

        emitter.setRotation(0, 0);
        emitter.setAlpha(0.3, 0.8);
        emitter.setScale(0.8, 1);
        emitter.gravity = -200;

        //	false means don't explode all the sprites at once, but instead release at a rate of one particle per 100ms
        //	The 5000 value is the lifespan of each particle before it's killed
        emitter.start(false, 5000, 100);


        //Draw background for panel
        this.background = this.add.graphics(0, 0);
        //this.background.beginFill(0x000000);
        this.background.drawRect(0, 0, 1280, 720);
        this.background.endFill();

        //Draw panel
        this.panel = this.add.sprite(this.game.world.centerX,
            this.game.world.centerY + 20, 'menupanel');
        this.panel.anchor.setTo(0.5);

        //Draw logo (just text for now)
        this.logo = this.add.text(this.game.world.centerX,
            40, 'Cybercrime', titleStyle);
        this.logo.anchor.setTo(0.5);

        //Draw play game button
        this.playbtn = this.add.button(this.game.world.centerX,
            this.game.world.centerY - 130, 'button', this.startGame, this)
        this.playbtn.anchor.setTo(0.5);

        this.playtext = this.add.text(this.game.world.centerX,
            this.game.world.centerY - 128, 'Play', menuStyle);
        this.playtext.anchor.setTo(0.5);

        //Draw tutorial button
        this.tutbtn = this.add.button(this.game.world.centerX,
            this.game.world.centerY - 30, 'button', this.startTutorial, this)
        this.tutbtn.anchor.setTo(0.5);

        this.tuttext = this.add.text(this.game.world.centerX,
            this.game.world.centerY - 28, 'Tutorial', menuStyle);
        this.tuttext.anchor.setTo(0.5);

        //Draw leaderboard button
        this.leaderboardBtn = this.add.button(this.game.world.centerX,
            this.game.world.centerY + 70, 'button', this.showLeaderboard, this)
        this.leaderboardBtn.anchor.setTo(0.5);

        this.leaderboardText = this.add.text(this.game.world.centerX,
            this.game.world.centerY + 72, 'Leaderboard', menuStyle);
        this.leaderboardText.anchor.setTo(0.5);
        
        //Uncomment to skip menu for testing
        //this.state.start('Game');

    },
    startGame: function () {
        this.menumusic.stop() // stop menu music
        this.state.start('Game');
        InsurancePlz.isTutorial = false; // global variabel to define normal game status
    },
    startTutorial: function () {
        this.menumusic.stop() // stop menu music
        this.state.start('Game');
        InsurancePlz.isTutorial = true; // global variable to define tutorial status
    },
    showLeaderboard: function() {
        createLeaderboard(this.game);
    }
};