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
    background: 0x262626,
    opacity: 1,
    outline: 0x18CC64,
    outlineThickness: 1,
    outlineOpacity: 1,
    width: opt.width,
    height: opt.height,
    margin: 3
  }))
  // Define the text style
  var style = { font: "24px Arial", fill: "#ffffff", align: "center" };
  // Add the elements for the available attack points
  this.game.add.text(10, 5, "Available Attack Points:", style, this);
  this.progressBar = new InsurancePlz.ProgressBar(game, 11, 45, 10, 10);
  this.progressBar.setProgress(5);
  this.add(this.progressBar)
  this.progressText = this.game.add.text(315, 58, "10/10", style, this);
  this.progressText.anchor = new Phaser.Point(1,0.5)
  // Add the damage text
  this.damageText = this.game.add.text(10, 75, "Damage: $0", style, this);
}

InsurancePlz.InformationBox.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.InformationBox.prototype.constructor = InsurancePlz.InformationBox;

/**
 * Update the amount of damage that is shown in the information box.
 * @param {Number} amount - The amount to show in the box
 */
InsurancePlz.InformationBox.prototype.updateDamage = function(amount) {
  this.damageText.text = "Damage: $" + amount;
}

/**
 * Update the available amount of attack points. Updates the text and the progress bar.
 * @param {Number} attackPoints - The still available attack points
 */
InsurancePlz.InformationBox.prototype.updateAttackPoints = function(attackPoints) {
  this.progressBar.setProgress(attackPoints);
  this.progressText.text = attackPoints + "/10";
}
