var HomeState = {

  init: function(message) {
    this.message = message;
  },

  create: function() {
    // set the backgroundsprite and enable input to prepare for event listening
    var background = this.game.add.sprite(0,0,'background');
    background.inputEnabled = true;

    // when screen is pressed we start the game and move to another state
    background.events.onInputDown.add(function(){
      this.state.start('GameState');
    }, this);

    var style = {font: '35px Arial', fill: '#fff'};
    this.game.add.text(30, this.game.world.centerY + 200, 'TOUCH TO START', style);
  
    if(this.message) {
      this.game.add.text(60, this.game.world.centerY - 200, this.message, style);
    }
  }
};