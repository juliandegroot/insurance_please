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

  var news = this.data.text + "\n" + this.data.name + "\n" + this.data.category + "\nDamge: " + this.data.damage + "\nSecurity Vector: \n" + this.getVectorString();
    
  this.state.newspanelLabel.text = news;
  

  //are we selecting anything?
  var selectedAttack = this.state.selectedAttack;

  if(selectedAttack) {
    //are there interactions? are they with the selected attack?
      
    var secvector = this.state.selectedAttack.data.securityVector; // the attack's security vector object
        for (var k in secvector){ // getting the actual array
            for (var j in secvector[k]){ // getting the key
                //string = string + j + ": " + secvector[k][j] + "\n";
                //console.log(j + ": " + secvector[k][j] + "\n");
                // execute attack on target feature j with effectiveness secvector[k][j]
                if (secvector[k][j] == 1) { // if the attack has any effect on a sec measure, we attack
                    console.log("attack effectiveness for " + j + " detected");
                    this.data.damage = this.executeAttack(j, secvector[k][j]);
                    this.state.clearAttackSelection(); // deselect attack
                    this.state.updateNews(this.data.text + "\n" + this.data.name + "\n" + this.data.category + "\nDamge: " + this.data.damage + "\nSecurity Vector: \n" + this.getVectorString());
                    //this.state.updateNews(this.data.text + "\n" + this.data.name + "\n" + this.data.category + "\nDamge: " + this.data.damage + "\nSecurity Vector: \n" + this.getVectorString(), this.state); // update news
                }
        }
    }    
      
    if(this.data.interactions && this.data.interactions[this.state.selectedAttack.data.id]) {

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

InsurancePlz.Target.prototype.executeAttack = function(secmeasure, effectiveness) {
    var damage_inflicted = 0;
    var secvector = this.data.securityVector; // the target's security vector object
        for (var k in secvector){ // getting the actual array
            for (var j in secvector[k]){ // getting the key
                console.log(j);
                if (j == secmeasure && secvector[k][j] == 0) { // this is the security measure we need to check effect on
                    //console.log(secmeasure);
                    //console.log(this.data.impact);
                    damage_inflicted = damage_inflicted + (5000 * this.data.impact * effectiveness);
                }
        }
    }
    console.log(damage_inflicted + " total damage inflicted");
    return damage_inflicted;
};