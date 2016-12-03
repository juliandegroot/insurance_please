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
    this.attackpanelLabel = this.add.text(10, 400, '', style);
      
    //newspanel area
    this.newspanel = this.add.sprite(640, 0, 'newspanel');
    this.newspanelLabel = this.add.text(644, 15, '', style);
    
    //loading the map with targets and attacks
    this.loadMap();
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
  }  
};
