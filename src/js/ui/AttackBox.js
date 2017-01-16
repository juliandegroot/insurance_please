var InsurancePlz = InsurancePlz || {};

InsurancePlz.AttackBox = function(game, x, y, options) {
  Phaser.Group.call(this, game);
  this.x = x;
  this.y = y;

  var opt = options || {
    width: 640,
    height: 110
  };

  this.add(new InsurancePlz.BackgroundBox(game, 0, 0, {
    background: 0x262626,
    opacity: 1,
    outline: 0x18CC64,
    outlineThickness: 1,
    outlineOpacity: 1,
    width: opt.width,
    height: opt.height,
    margin: 3
  }));
};

InsurancePlz.AttackBox.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.AttackBox.prototype.constructor = InsurancePlz.AttackBox;
