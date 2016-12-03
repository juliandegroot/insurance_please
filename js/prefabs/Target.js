var InsurancePlz = InsurancePlz || {};

InsurancePlz.Target = function(state, data) {
  Phaser.Sprite.call(this, state.game, data.x, data.y, data.asset);

    this.game = state.game;
    this.state = state;
    this.anchor.setTo(0.5);
    this.scale.setTo(0.07);
    this.data = data;


  //listen for input
  this.inputEnabled = true;
  this.input.pixelPerfectClick = true;
  this.events.onInputDown.add(this.touch, this);
};

InsurancePlz.Target.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.Target.prototype.constructor = InsurancePlz.Target;

InsurancePlz.Target.prototype.touch = function() {
  //shows target info in news panel:

  
    
  this.state.newspanelLabel.text = this.data.text + "\n" + this.data.name + "\n" + this.data.category + "\nDamge: " + this.data.damage + "\nSecurity Vector: \n" + this.getVectorString();
  

  //are we selecting anything?
  var selectedAttack = this.state.selectedAttack;

  if(selectedAttack) {
    //are there interactions? are they with the selected attack?
    if(this.data.interactions && this.data.interactions[this.state.selectedItem.data.id]) {

      //we do have an interaction between the "Target" and the selected attack
      var interaction = this.data.interactions[this.state.selectedItem.data.id];

      //show target name and attributes
      if(interaction.text) {
        this.state.newspanelLabel.text = interaction.text;
      }

      //change target asset (new image to show damage?)
      if(interaction.asset) {
        this.loadTexture(interaction.asset);
        this.data.asset = interaction.asset;
      }
    }
  }
};

InsurancePlz.Target.prototype.getVectorString = function() {
    var secvector = this.data.securityVector; // the target's security vector object
    var string = "";
        for (var k in secvector){ // getting the actual array
            for (var j in secvector[k]){ // getting the key
                string = string + j + ": " + secvector[k][j] + "\n";
                //console.log(string);
        }
    }
    return string;
};