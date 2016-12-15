var InsurancePlz = InsurancePlz || {};

InsurancePlz.GameState = {

  init: function(playerData) {
    this.playerData = playerData ? playerData : {};
    // player starts out with attackmap europe:
    this.playerData.attackmap = this.playerData.attackmap ? this.playerData.attackmap : 'europe';

    this.gameProgress = {
      "turn":1,
      "actionPoints":100,
      "actionPointsMax":100,
      "score":0,
      "attackstack": [],
      "index": 0,
      "buttonstack": [[650,false],[700,false],[750,false],[800,false],[850,false]],
      "textstack": [[650,''],[700,''],[750,''],[800,''],[850,'']]
    };

    //TODO: These JSON's should be removed from the cache afterwards.
    this.attackDataList = createAttacksFromJSON(this.game.cache.getText('attacks'));
    this.majorEventList = createMajorEventsFromJSON(this.game.cache.getText('major_events'));
    this.minorEventList = createMinorEventsFromJSON(this.game.cache.getText('minor_events'));
    //console.log(this.attackDataList);
    console.log(this.majorEventList);
    console.log(this.minorEventList);
  },
  create: function() {
    //attackpanel area
    this.attackpanel = this.add.sprite(0, 405, 'attackpanel');
    var style = {
        color: 'white',
        // temp font, need to find font for commercial use
      font: '15px HackerFont',
      fill: '#fff',
      align: 'left',
      wordWrap: true,
      wordWrapWidth: 256
    };
     var scorestyle = {
        color: 'red',
        // temp font, need to find font for commercial use
      font: '15px HackerFont',
      fill: '#f00',
      align: 'left',
      wordWrap: true,
      wordWrapWidth: 256
    };
     var acpointsstyle = {
        color: 'yellow',
        // temp font, need to find font for commercial use
      font: '15px HackerFont',
      fill: '#f0f',
      align: 'left',
      wordWrap: true,
      wordWrapWidth: 256
    };
           var stackstyle = {
        color: 'yellow',
        // temp font, need to find font for commercial use
      font: '15px HackerFont',
      fill: '#ffff00',
      align: 'left',
      wordWrap: true,
      wordWrapWidth: 256
    };
    this.attackpanelLabel = this.add.text(10, 400, '', style);

    //newspanel area
    this.newspanel = this.add.sprite(640, 0, 'newspanel');
    this.newspanelLabel = this.add.text(644, 15, '', style);

    //scoreboard logo

    //loading the map with targets and attacks
    this.createMap();

    this.damagelogo = this.add.sprite(0, 0, 'hackdamage');
    this.damagelogo.scale.setTo(0.1);
    //overlay scoreboard text
    hackingdamageText = this.game.add.text(480, 30, '', scorestyle);
    //actionpoints text
    actionpointsText = this.game.add.text(480, 10, '', acpointsstyle);
    stackText1 = this.game.add.text(650, 350, '', stackstyle);
      stackText2 = this.game.add.text(700, 350, '', stackstyle);
      stackText3 = this.game.add.text(750, 350, '', stackstyle);
      stackText4 = this.game.add.text(800, 350, '', stackstyle);
      stackText5 = this.game.add.text(850, 350, '', stackstyle);
    this.refreshStats();

    //end turn button and start of game
    this.endturnbtn = this.add.button(700, 450, 'button-circle', this.endTurn, this);
    this.endturntext = this.add.text(715, 470, 'End turn', style);
    this.stackboxtext = this.add.text(650, 330, '', style);

    //group of stacked attack buttons:
    this.stackedattacks = this.add.group();

    //start turn:
    this.startTurn();
  },

  /**
    * createMap creates the map part of the game: it reads in the targets, attacks
    * and assigns them to a possition in the UI.
    */
  createMap: function() {
    this.attackMapData = JSON.parse(this.game.cache.getText(this.playerData.attackmap));
    let targets = this.createTargetData(this.attackMapData, JSON.parse(this.game.cache.getText('targets')).targets);

    this.attackMapData.targets = targets;

    this.background = this.add.sprite(0, 0, this.attackMapData.background);
    //create target instances
    this.targets = this.add.group();
    var target;
    targets.forEach(function(targetData){
      target = new InsurancePlz.Target(this, targetData);
      this.targets.add(target);
    }, this);

    //create attack instances
    this.attacks = this.add.group();
    var attack;
    this.attackMapData.attacks.forEach(function(attackData){
      attack = new InsurancePlz.Attack(this, attackData);
      this.attacks.add(attack);
    }, this);
  },

  /**
    * Creates an array of target data. To each location in the AttackMapData a
    * random target is assigned. The target data array contains the original
    * target data with the additional location coordinates.
    * @param {Object[]} attackMapData - The structure holding all data for the attack map.
    * @param {Number} attackMapData.targetNumber - The number of targets for the map.
    * @param {Object[]} attackMapData.locations - Array of arrays of locations. Each location array in the array consists of x and y coordinates at index 0 and 1 respectively.
    * @param {Object[]} targetData - The structure holding all the data of the targets.
    * @returns {Array} finalTargets - The array containing the target with their locations.
    */
  createTargetData: function(attackMapData, targetData) {
    let targetNumber = attackMapData.numberOfTargets;
    let targetLocations = attackMapData.locations;
    let targets = targetData;
    let finalTargets = [];

    for (i = 0; i < targetNumber; i++) {
      // Choose a random target from the remaining targets.
      let j = Math.floor(Math.random() * targets.length);
      let target = targets[j];
      // Assign the location coordinates
      target.x = targetLocations[i][0];
      target.y = targetLocations[i][1];
      // Add the target to the final target list
      finalTargets.push(target);
      // Remove the assigned target from the unassigned list
      targets.splice(j,1);
    }
    return finalTargets;
  },


  selectAttack: function(attack) {
    if(this.selectedAttack != attack) {
      this.clearAttackSelection();
      this.selectedAttack = attack;
      this.selectedAttack.alpha = 0.5;
    }
    else {
      this.clearAttackSelection();
    }
  },
  clearAttackSelection: function() {
    this.selectedAttack = null;
    this.attacks.setAll('alpha', 1);
  },
  updateNews: function(news) {
      this.newspanelLabel.text = news;
  },
  refreshStats: function() {
      var total = 0
      for (var k in this.attackMapData.targets){ // getting the actual array
          for (var l in this.attackMapData.targets[k]) {
              if (l == "damage") {
                 //console.log("l: " +this.attackMapData.targets[k][l]);
                  total = total + this.attackMapData.targets[k][l];
              }

              //total = total + k
          }
      }
      this.gameProgress.score = total;
      hackingdamageText.text = "$ " +this.gameProgress.score +"\nDamage total";
      actionpointsText.text = "A.points: " +this.gameProgress.actionPoints;
  },
  giveAvailableButtonx: function() {
      console.log("hier2");console.log(this.gameProgress.buttonstack);
      for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
          if(this.gameProgress.buttonstack[i][1] == false) {
              //console.log(this.gameProgress.buttonstack[i][0]);
              return this.gameProgress.buttonstack[i][0]; // return first available x

          }
      }
  },
  checkAllButtonsAvailable: function() {
      console.log("testje");
      for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
          if(this.gameProgress.buttonstack[i][1] != false) { // false is empty
              return true;
          }
      }
      return false;
  },
  setButtonxTaken: function(coordx) {
   for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
          if(this.gameProgress.buttonstack[i][0] == coordx) {
              this.gameProgress.buttonstack[i][1] = true; // taken

          }
      }
  },
  setButtonxAvailable: function(coordx) {
   for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
          if(this.gameProgress.buttonstack[i][0] == coordx) {
              this.gameProgress.buttonstack[i][1] = false; // taken

          }
      }
  },
  setAllButtonxAvailable: function() { // at round end
   for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
      this.gameProgress.buttonstack[i][1] = false; // taken
      }
  },
  stackAttack: function(target, attack, sprite){
      this.gameProgress.attackstack.push([target,attack]);
      var spritename = sprite + '_small';
      //under here we have to check in some sort of array if on all possible x's 650,700,750,800,850 there is a true or false
      // to know whether , check for first false x in buttonstack and return that so we can use it here
      //if (this.gameProgress.buttonstack)
      var newx = this.giveAvailableButtonx();
      this.stackbutton = this.add.button(newx, 350, spritename, this.removeFromStack, this);
      this.setButtonxTaken(newx); // set previously given out button position as taken
      //this.stackbutton.input.enabled = false;
      this.stackbutton.targetid = target.getID();
      this.stackbutton.attackpoints = attack.getPoints();
      this.stackbutton.attackid = attack.getID();
      this.stackbutton.xcoord = newx;
      var scorestyle = {
        color: 'red',
        // temp font, need to find font for commercial use
      font: '15px HackerFont',
      fill: '#f00',
      align: 'left',
      wordWrap: true,
      wordWrapWidth: 256

    };


      this.gameProgress.index += 50;
      this.stackedattacks.add(this.stackbutton);
      this.stackboxtext.text = 'Stacked Attacks:';

      if (newx == 650) { stackText1.text = this.stackbutton.targetid; }
      if (newx == 700) { stackText2.text = this.stackbutton.targetid;}
      if (newx == 750) { stackText3.text = this.stackbutton.targetid;}
      if (newx == 800) { stackText4.text = this.stackbutton.targetid;}
      if (newx == 850) { stackText5.text = this.stackbutton.targetid;}
      this.game.world.bringToTop(stackText1);this.game.world.bringToTop(stackText2);this.game.world.bringToTop(stackText3);this.game.world.bringToTop(stackText4);this.game.world.bringToTop(stackText5);

  },
  removeFromStack: function(button) {
      console.log("button tid: " + button.targetid);console.log(button.attackid);
      var i = this.gameProgress.attackstack.length;
          while (i--) {
              var targetid = this.gameProgress.attackstack[i][0].getID();
              var attackid = this.gameProgress.attackstack[i][1].getID();
              //console.log(targetid);
              if (targetid == button.targetid && attackid == button.attackid) {
                    this.gameProgress.attackstack.splice(i,1); // hier gaat ie mis want pop(i)
                    this.setButtonxAvailable(button.xcoord);
                    if (button.xcoord == 650) { stackText1.text = ''; }
                    if (button.xcoord == 700) { stackText2.text = '';}
                    if (button.xcoord == 750) { stackText3.text = '';}
                    if (button.xcoord == 800) { stackText4.text = '';}
                    if (button.xcoord == 850) { stackText5.text = '';}
                    //console.log("bli");console.log(this.gameProgress.attackstack);
                    button.destroy();
                    this.gameProgress.actionPoints += button.attackpoints;
                    this.refreshStats();
                    //console.log("roep die flush aan");
                    //this.flushAttackStack();

              }

          }
        if (this.checkAllButtonsAvailable() == false) { this.stackboxtext.text = ''; }
  },
  flushAttackStack: function(){
      var i = this.gameProgress.attackstack.length;
          while (i--) {
          console.log("destroying " + i);
          this.stackedattacks.children[i].destroy();
      }
      this.stackboxtext.text = '';stackText1.text = '';stackText2.text = '';stackText3.text = '';stackText4.text = '';stackText5.text = ''
  },
  clearAttackStack: function(){
      this.gameProgress.attackstack = [];
  },
  executeAttacks: function(){
      // for each target and attack combination in the attackstack array:
      //console.log("the attack stack:");console.log(this.gameProgress.attackstack);

      for(var i = 0; i < this.gameProgress.attackstack.length; i++) {
          var target = this.gameProgress.attackstack[i][0];
          var attack = this.gameProgress.attackstack[i][1];
          //console.log(target);
          target.doDamage(attack.getSecmeasure(), attack.getEffect());
      }
            // to be executed after actual max stack is reached (to end round):
            //this.state.updateNews(this.data.text + "\n" + this.data.name + "\n" + this.data.category + "\nDamge: " + this.data.damage + "\nSecurity Vector: \n" + this.getVectorString());
  },
  alreadyStackedForTarget: function(target_id, attack_id) {
      //console.log("the attack stack:");console.log(this.gameProgress.attackstack);
      for(var i = 0; i < this.gameProgress.attackstack.length; i++) {
          var target = this.gameProgress.attackstack[i][0];
          var attack = this.gameProgress.attackstack[i][1];
          var tar_id = target.getID();
          var atk_id = attack.getID();
          if (tar_id == target_id && atk_id == attack_id ) {
              console.log("Combination already stacked! Tar_id: " + tar_id + " Atk_id: " +atk_id );
              return true
          }
      }
      return false;
  },
  closePopup: function(){
    this.popup.destroy();
  },
  startTurn: function(){
    this.triggerMajorEvent();
  },
  endTurn: function(){
    this.flushAttackStack(); // buttons on the right in panel
    this.executeAttacks()// we are executing our attacks
    this.clearAttackStack(); // clear stacked attack array
    this.setAllButtonxAvailable(); // all button positions can be taken again
    this.gameProgress.index = 0;
    this.gameProgress.turn++;
    this.gameProgress.actionPoints=this.gameProgress.actionPointsMax;
    this.refreshStats(); // update stats
    console.log('It is now turn: ' + this.gameProgress.turn);
    if (this.gameProgress.turn > 3){
      this.endGame();
    } else {
      this.startTurn();
    }
  },
  endGame: function(){
    this.popup = new Popup("Congratulations!", "You have reached the end of the prototype game!");
  },
  /**
    * Executes (a number of?) minor, silent events.
    * Decides which event to trigger using a roulette system based on the weights of each event.
    */
  triggerMinorEvent(){
    let roulette = [];
    for (var i=0;i<this.minorEventList.length;i++){
      console.log(this.minorEventList[i]);
      for (var j=0;j<this.minorEventList[i].getWeight();j++){
        roulette.push(i);
      }
    }
    this.minorEventList[roulette[Math.floor(Math.random()*roulette.length)]].execute();
  },
  /**
    * Executes a major event and adds it to the list of news items events.
    * Decides which event to trigger using a roulette system based on the weights of each event.
    */
  triggerMajorEvent(){
    let roulette = [];
    for (var i=0;i<this.majorEventList.length;i++){
      for (var j=0;j<this.majorEventList[i].getWeight();j++){
        roulette.push(i);
      }
    }
    if (roulette.length>0){
      let rand = Math.floor(Math.random()*roulette.length);
      //TODO: Add result to news list
      //x.push(this.majorEventList[rand].getNews());
      //Execute event
      this.majorEventList[roulette[rand]].execute();
      //Prevent event from being executed again
      this.majorEventList.splice(i, i);
    }
  },
  triggerMajorEvent_global_pw_protection(){
    this.globalSecurityUpgrade("pw_protection");
  },
  triggerMajorEvent_global_physical_security(){
    this.globalSecurityUpgrade("physical_security");
  },
  triggerMajorEvent_global_ddos_protection(){
    this.globalSecurityUpgrade("ddos_protection");
  },
  /**
    * Sets the security level of the given key for every target to 1 (maximum).
    */
  globalSecurityUpgrade(key){
    for (var i=0;i<this.targets.children.length;i++){
      this.targets.children[i].data.securityVector[key]=1;
    }
  },
  /**
    * Attempts to upgrade a random key in the security vector of a random target.
    * @returns {Boolean} success - True or false depending on whether an upgradable target was found.
    */
  triggerMinorEvent_security_upgrade(){
    console.log("Security upgraded");
    let list = [];
    for (var i=0;i<this.targets.children.length;i++){
      if (this.targets.children[i].canBeUpgraded()){
        list.push(i);
      }
    }
    if (list.length>0){
      let r = Math.floor(Math.random()*list.length);
      this.targets.children[list[Math.floor(Math.random()*list.length)]].upgradeSecurity();
      return true;
    } else {
      return false;
    }
  },
  /**
    * Increases the impact of a random target by 1.
    */
  triggerMinorEvent_impact_upgrade(){
    console.log("Impact upgraded");
    this.targets.children[Math.floor(Math.random()*this.targets.children.length)].data.impact++;
    return true;
  }
};
