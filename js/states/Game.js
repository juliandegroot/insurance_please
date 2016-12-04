var InsurancePlz = InsurancePlz || {};

InsurancePlz.GameState = {

  init: function(playerData) {
    this.playerData = playerData ? playerData : {};
    // player starts out with attackmap europe:
    this.playerData.attackmap = this.playerData.attackmap ? this.playerData.attackmap : 'europe';

    this.gameProgress = {
      "turn":1,
      "actionPoints":1,
      "actionPointsMax":1,
      "score":0
    };
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
    this.attackpanelLabel = this.add.text(10, 400, '', style);
      
    //newspanel area
    this.newspanel = this.add.sprite(640, 0, 'newspanel');
    this.newspanelLabel = this.add.text(644, 15, '', style);
    
    //scoreboard logo
    
    //loading the map with targets and attacks
    this.loadMap();
    this.damagelogo = this.add.sprite(0, 0, 'hackdamage');
    this.damagelogo.scale.setTo(0.1);
    //overlay scoreboard text
    hackingdamageText = this.game.add.text(10, 10, '', scorestyle);
    this.refreshStats();

    //end turn button and start of game
    this.endturnbtn = this.add.button(700, 350, 'button-circle', this.endTurn, this);
    this.endturntext = this.add.text(715, 410, 'End turn', style)
    this.startTurn();
  },
  loadMap: function() {
    //loading all targets and attacks for this attackmap
    this.attackmapData = JSON.parse(this.game.cache.getText(this.playerData.attackmap));
    this.background = this.add.sprite(0, 0, this.attackmapData.background);

    //create target instances
    this.targets = this.add.group();
    var target;
    this.attackmapData.targets.forEach(function(targetData){
      target = new InsurancePlz.Target(this, targetData);
      this.targets.add(target);
    }, this);
      
    //create attack instances
    this.attacks = this.add.group();
    var attack;
    this.attackmapData.attacks.forEach(function(attackData){
      attack = new InsurancePlz.Attack(this, attackData);
      this.attacks.add(attack);
    }, this);      
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
      var stats = 0;
      for (var k in this.attackmapData.targets){ // getting the actual array
          console.log(this.attackmapData.targets[k].damage);
              stats = stats + this.attackmapData.targets[k].damage;
          
      }
      hackingdamageText.text = "Total: $ " +stats;
  },


  closeNews: function(){
    console.log('Closing news');
    this.popup.group.destroy();
  },
  openNews: function(){
    this.popup = {};
    this.popup.group = this.add.group();
    this.popup.overlay = this.add.graphics(0, 0);
    this.popup.overlay.inputEnabled = true;
    this.popup.overlay.beginFill(0x000000, 0.5);
    this.popup.overlay.drawRect(0, 0, 1000, 1000);
    this.popup.overlay.endFill();
    this.popup.panel = this.add.sprite(180, 60, 'popuppanel');
    var style = {
      color: 'white',
      font: '15px HackerFont',
      fill: '#fff',
      align: 'center',
      boundsAlignH: 'center',
      wordWrap: true,
      wordWrapWidth: 440
    };
    this.popup.message = this.add.text(200, 80, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id eleifend est. Nulla gravida vel turpis non mattis. Quisque non pellentesque orci. Nulla porttitor mattis ligula, et dignissim urna ultrices eu. Vestibulum quis tempor leo. Proin fermentum quis orci quis convallis. Sed ullamcorper auctor lectus, sed blandit dolor. Integer non mi in urna molestie consectetur.', style);
    this.popup.button = this.add.button(300, 350, 'button', this.closeNews, this)//, this, 'button', 'button', 'button', 'button', this.popup);
    this.popup.buttontext = this.add.text(390, 370, 'Close', style);

    this.popup.group.add(this.popup.overlay);
    this.popup.group.add(this.popup.panel);
    this.popup.group.add(this.popup.message);
    this.popup.group.add(this.popup.button);
    this.popup.group.add(this.popup.buttontext);
  },


  startTurn: function(){
    //Pop up news message, fade out & make uninteractable rest of game
    this.openNews();
  },
  endTurn: function(){
    this.gameProgress.turn++;
    this.gameProgress.actionPoints=this.gameProgress.actionPointsMax;
    console.log('It is now turn: ' + this.gameProgress.turn);
    if (this.gameProgress.turn > 3){
      //End game code
    } else {
      this.startTurn();
    }
  },
};
