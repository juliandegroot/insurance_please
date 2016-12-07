var InsurancePlz = InsurancePlz || {};

InsurancePlz.TargetData = function(name, category, securityVector, impact,spriteTag) {
  this.name = name;
  this.category = category;
  this.securityVector = securityVector;
  this.impact = impact;
  this.sprite = spriteTag;

  console.log('TargetData created: {' + this.name + ',' + this.category + ',' + this.securityVector + ',' + this.impact + ',' + this.sprite + '}');
}

// TODO: is this needed?
InsurancePlz.TargetData.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.TargetData.prototype.constructor = InsurancePlz.TargetData;

InsurancePlz.TargetData.prototype.updateSecurityVector = function(securityVector) {
  this.securityVector = securityVector;
};
