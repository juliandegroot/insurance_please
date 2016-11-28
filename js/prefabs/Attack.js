var InsurancePlz = InsurancePlz || {};

InsurancePlz.Attack = function(state, data) {
  Phaser.Sprite.call(this, state.game, data.x, data.y, data.asset);

    this.game = state.game;
    this.state = state;
    //this.anchor.setTo(0.5);
    this.scale.setTo(0.05);
    this.data = data;

  //listen for input
  this.inputEnabled = true;
  this.input.pixelPerfectClick = true;
  this.events.onInputDown.add(this.touch, this);
};

InsurancePlz.Attack.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.Attack.prototype.constructor = InsurancePlz.Attack;

InsurancePlz.Attack.prototype.touch = function() {
  this.state.newspanelLabel.text = this.data.text;

  //if it's a collectable then collect it!
  if(this.data.type == 'collectable') {
    this.state.addItem(this.data);
    this.kill();
    return;
  }

  //if it's an open door, go to another room
  else if(this.data.type == 'door' && this.data.isOpen) {
    var playerData = {
      room: this.data.destination,
      items: []
    };

    //pass item data
    this.state.items.forEachAlive(function(item){
      playerData.items.push(item.data);
    }, this);

    this.game.state.start('Game', true, false, playerData);
    return;
  }

  //are we selecting anything?
  var selectedItem = this.state.selectedItem;

  if(selectedItem) {
    //are there interactions? are they with the selected item?
    if(this.data.interactions && this.data.interactions[this.state.selectedItem.data.id]) {

      //we do have an interaction between the "Attack" and the selected item
      var interaction = this.data.interactions[this.state.selectedItem.data.id];

      //show text
      if(interaction.text) {
        this.state.newspanelLabel.text = interaction.text;
      }

      //change asset
      if(interaction.asset) {
        this.loadTexture(interaction.asset);
        this.data.asset = interaction.asset;
      }

      //open door
      if(interaction.action == 'open-door') {
        this.data.isOpen = true;
        selectedItem.kill();
        this.state.clearSelection();
      }
    }
  }

};