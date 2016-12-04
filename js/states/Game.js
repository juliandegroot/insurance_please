var InsurancePlz = InsurancePlz || {};

InsurancePlz.GameState = {

  init: function(playerData) {
    this.playerData = playerData ? playerData : {};
    // player starts out with attackmap europe:
    this.playerData.attackmap = this.playerData.attackmap ? this.playerData.attackmap : 'europe';
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
  } 
};
