var PreloadState = {
	//load the game assets before the game starts
  preload: function() {

    // add a logo
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadBar');
    // make sure its not placed by left corner but actual middle:
    this.preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    // load all images to be used for sprites/spritesets in the game
    this.load.image('background', 'assets/images/backyard.png');     
  },
  create: function() {
    this.state.start('HomeState');
  }
};