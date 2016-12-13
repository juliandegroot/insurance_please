var InsurancePlz = InsurancePlz || {};

InsurancePlz.Target = function(state, data) {
  Phaser.Sprite.call(this, state.game, data.x, data.y, data.asset);

    this.game = state.game;
    this.state = state;
    this.anchor.setTo(0.5);
    this.scale.setTo(0.07);
    this.data = data;
    this.damage = this.data.damage;

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
                // execute attack on target feature j with effectiveness secvector[k][j]
                if (secvector[k][j] == 1) { // if the attack has any effect on a sec measure, we attack
                    console.log("Vulnerability " + j + " for Tar_id: " + this.data.id + " detected");

                    if (((this.state.gameProgress.actionPoints - this.state.selectedAttack.data.points) >= 0) && (this.state.alreadyStackedForTarget(this.data.id, this.state.selectedAttack.data.id) == false)) {
                        //while attack points last and selected attack does not let us drop below 0:
                        //throw combination of target & attack object into array while points last to execute these combinations when user clicks button "attack" at which a round ends.
                        // and cannot stack same tar/attack combination more than once
                        this.state.stackAttack(this, this.state.selectedAttack, this.state.selectedAttack.data.asset);
                        this.state.gameProgress.actionPoints = this.state.gameProgress.actionPoints - this.state.selectedAttack.data.points;
                        this.state.refreshStats();
                        console.log("Stacked: Target_id: " + this.data.id + " Attack_id: " + this.state.selectedAttack.data.id);
                        this.state.clearAttackSelection(); // deselect attack

                    }
                    else {
                        console.log("Cannot stack, not enough points or already stacked");
                        this.state.clearAttackSelection(); // deselect attack
                    }
                }
                console.log("Current action points: " + this.state.gameProgress.actionPoints);

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

InsurancePlz.Target.prototype.getDamage = function() {
    return this.damage;
};

InsurancePlz.Target.prototype.getID = function() {
    return this.data.id;
};

InsurancePlz.Target.prototype.getName = function() {
    return this.data.name;
};

InsurancePlz.Target.prototype.doDamage = function(secmeasure, effectiveness, attackname, targetname) {
    console.log("attack vector: ");console.log(secmeasure);
    console.log("target secvector: ");console.log(this.data.securityVector[0]);
    var damage_inflicted = 0;
    var secvector = this.data.securityVector; // the target's security vector object
    //console.log("c:" + secmeasure);
        for (var k in secvector){ // getting the actual array
            //console.log("k in secvector: " + k);
            for (var j in secvector[k]){ // getting the key
                //console.log("j: " + j);
                    for (var a in secmeasure) { // getting the array inside secmeasure object
                        //console.log("a: " + a);console.log("Ba :" + secmeasure[a])
                        if (j == a && secmeasure[a] == 1 && secvector[k][j] == 0) { //vulnerability found!
                                console.log("vul found on "+j);
                                damage_inflicted = 5000 * this.data.impact;
                                this.state.generateAttackNewsItem(damage_inflicted, attackname, targetname, this.data.category);
                            }
                        else {
                            console.log("no vulnerabities found on sec vector");
                        }
                    }
            }

        }
    console.log(damage_inflicted + " total damage inflicted");
    this.data.damage = this.data.damage + damage_inflicted; // increment damage for this target

};
