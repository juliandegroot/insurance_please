var InsurancePlz = InsurancePlz || {};

InsurancePlz.InformationBox = function(game, x, y, options) {
  Phaser.Group.call(this, game);
  this.x = x;
  this.y = y;

  var opt = options || {
    width: 320,
    height: 110
  }

  this.add(new InsurancePlz.BackgroundBox(game, 0, 0, {
    background: 0xFF3300,
    opacity: 1,
    outline: 0x0000FF,
    outlineThickness: 1,
    outlineOpacity: 1,
    width: opt.width,
    height: opt.height,
    margin: 3
  }))

  var pb = new InsurancePlz.ProgressBar(game, 10, 10, 9, 10);
  pb.setProgress(5);
  this.add(pb)
}

InsurancePlz.InformationBox.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.InformationBox.prototype.constructor = InsurancePlz.InformationBox;
