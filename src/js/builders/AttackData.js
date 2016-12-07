var InsurancePlz = InsurancePlz || {};

InsurancePlz.AttackData = function(name, securityVector, spriteTag) {
  this.name = name;
  this.securityVector = securityVector;
  this.sprite = spriteTag;

  console.log('AttackData created: {' + this.name + ',' + this.securityVector + ',' + this.sprite + '}');
}

// TODO: is this needed?
InsurancePlz.AttackData.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.AttackData.prototype.constructor = InsurancePlz.AttackData;

InsurancePlz.AttackData.prototype.updateSecurityVector = function(securityVector) {
  this.securityVector = securityVector;
};
