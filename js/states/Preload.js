var InsurancePlz = InsurancePlz || {};

//loading the game assets
InsurancePlz.PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(this.preloadBar);

    //load game assets

    this.load.image('attackpanel', 'assets/images/attackpanel.png');
    this.load.image('newspanel', 'assets/images/newspanel.png');
    this.load.image('europe', 'assets/images/attackmap.png');
    this.load.image('company', 'assets/images/building.png');
    
    //make sure all images are equal in size to prevent anchor and scaling issues
    this.load.image('database_attack', 'assets/images/database_attack.png');
    this.load.image('ddos_attack', 'assets/images/ddos_attack.png');

    //data files
    this.load.text('europe', 'assets/data/europe.json');
  },
  create: function() {
    this.state.start('Game');
  }
};