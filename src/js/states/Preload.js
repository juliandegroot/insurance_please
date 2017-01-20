var InsurancePlz = InsurancePlz || {};

/**
 * Prototype responsible for loading all assets. While this is in progress,
 * a loading bar will be displayed to players.
 */
InsurancePlz.PreloadState = {
    preload: function() {
        //show loading screen
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(100, 1);
        this.load.setPreloadSprite(this.preloadBar);

        //load menu assets
        this.load.image('menupanel', 'assets/images/menupanel.png');

        //load game assets
        this.load.image('howtoplaypanel', 'assets/images/howtoplaypanel.png');
        this.load.image('popuppanel', 'assets/images/popuppanel.png');
        this.load.image('europe', 'assets/images/attackmap.png');
        this.load.image('company', 'assets/images/building.png');

        //make sure all images are equal in size (150x161) to prevent anchor and scaling issues
        this.load.image('drivebydownload', 'assets/images/drivebydownload.png');
        this.load.image('freefoundusbstick', 'assets/images/freefoundusbstick.png');
        this.load.image('popup', 'assets/images/popup.png');
        this.load.image('roguewifi', 'assets/images/roguewifi.png');
        this.load.image('socialengineering', 'assets/images/socialengineering.png');
        this.load.image('spoofing', 'assets/images/spoofing.png');
        this.load.image('stolenpasswords', 'assets/images/stolenpasswords.png');
        this.load.image('arrowdown', 'assets/images/arrow_down.png');
        this.load.image('arrowright', 'assets/images/arrow_right.png');
        this.load.image('arrowleft', 'assets/images/arrow_left.png');
        
        //for the attack stack images:
        this.load.image('drivebydownload_small', 'assets/images/drivebydownload_small.png');
        this.load.image('freefoundusbstick_small', 'assets/images/freefoundusbstick_small.png');
        this.load.image('popup_small', 'assets/images/popup_small.png');
        this.load.image('roguewifi_small', 'assets/images/roguewifi_small.png');
        this.load.image('socialengineering_small', 'assets/images/socialengineering_small.png');
        this.load.image('spoofing_small', 'assets/images/spoofing_small.png');
        this.load.image('stolenpasswords_small', 'assets/images/stolenpasswords_small.png');
        this.load.image('sound', 'assets/images/sound.png');
        this.load.image('button', 'assets/images/button.png');
        this.load.image('howtoplay', 'assets/images/howtoplay.png');

        //data files
        this.load.text('europe', 'assets/data/europe.json');
        this.load.text('targets', 'assets/data/targets.json');
        this.load.text('tutorialtargets', 'assets/data/tutorialtargets.json');
        this.load.text('attacks', 'assets/data/attacks.json');
        this.load.text('minor_events', 'assets/data/minorEvents.json');
        this.load.text('major_events', 'assets/data/majorEvents.json');
        this.load.text('news', 'assets/data/news.json');
        
        // TODO: move
        this.load.image('button_small', 'assets/images/button_small.png');
        this.load.image('button_large', 'assets/images/button_large.png');

        //leaderboard assets
        this.load.image('page-prev', 'assets/images/page-prev.png');
        this.load.image('page-next', 'assets/images/page-next.png');

        //activate required plugin
        this.add.plugin(PhaserInput.Plugin);
    },
    create: function() {
        this.state.start('Menu');
    }
};
