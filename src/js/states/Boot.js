var InsurancePlz = InsurancePlz || {};

/**
 * Prototype responsible for the very initial booting of the game.
 * This loads the loading bar and sets a few basic window properties.
 */
InsurancePlz.BootState = {
    init: function() {
        //loading screen will have a white background
        this.game.stage.backgroundColor = '#fff';

        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    preload: function() {
        //assets we'll use in the loading screen
        this.load.image('bar', 'assets/images/preloader-bar.png');
    },
    create: function() {
        this.state.start('Preload');
    }
};