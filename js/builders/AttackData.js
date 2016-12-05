var InsurancePlz = InsurancePlz || {};

InsurancePlz.AttackData = function(name, securityVector, spriteTag) {
  this.name = name;
  this.securityVector = securityVector;
  this.sprite = spriteTag;

  console.log('AttackData created: {' + this.name + ',' + this.securityVector + ',' + this.sprite + '}');
}

// TODO: is this needed?
InsurancePlz.Attack.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.Attack.prototype.constructor = InsurancePlz.Attack;

InsurancePlz.Attack.prototype.updateSecurityVector = function(securityVector) {
  this.securityVector = securityVector;
};
