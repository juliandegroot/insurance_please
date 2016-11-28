//First playable will have only 1 state
var GameState = {

  //executed after everything is loaded
  create: function() {
    // add sprite as background and enable input to prepare for event listening
    this.background = this.game.add.sprite(0, 0, 'background');
    this.background.inputEnabled = true;
  },
  //executed multiple times per second
  update: function() {
  }
};