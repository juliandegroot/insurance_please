var InsurancePlz = InsurancePlz || {};

InsurancePlz.ProgressBar = function(game, x, y, progress, total, options) {
  Phaser.Graphics.call(this, game, x, y);
  this.progress = progress;
  this.total = total;
  this.options = options || {
    background: 0xFF00FF,
    bar: 0x00FFFF,
    outline: 0x000000,
    outlineThickness: 2,
    width: 200,
    height: 20
  };
  this.redrawGraphics();
}

InsurancePlz.ProgressBar.prototype = Object.create(Phaser.Graphics.prototype);
InsurancePlz.ProgressBar.prototype.constructor = InsurancePlz.ProgressBar;

/**
 * Update the progress of the progress bar to the specified value. This value
 * should be in the range [0,total]. Calling this method also updates the graphics
 * element.
 * @param {Number} progress - The progress to set the progress bar to.
 */
InsurancePlz.ProgressBar.prototype.setProgress = function(progress) {
  this.progress = progress;
  this.redrawGraphics();
}

/**
 * Redraws the graphics based on the progress and the other settings.
 */
InsurancePlz.ProgressBar.prototype.redrawGraphics = function() {
  this.clear();
  this.drawBackground();
  this.drawProgress();
  this.drawOutline();
}

/**
 * Draw the background and outline of the progress bar.
 */
InsurancePlz.ProgressBar.prototype.drawBackground = function() {
  this.beginFill(this.options.background, 1);
  this.drawRect(0, 0, this.options.width, this.options.height);
  this.endFill();
}

/**
 * Draw the progress based on the percentage of the total.
 */
InsurancePlz.ProgressBar.prototype.drawProgress = function() {
  this.beginFill(this.options.bar, 1);
  var width = this.progress / this.total * this.options.width;
  this.drawRect(0, 0, width, this.options.height);
  this.endFill();
}

/**
 * Draw the outline around the progress bar.
 */
InsurancePlz.ProgressBar.prototype.drawOutline = function() {
  this.lineStyle(this.options.outlineThickness, this.options.outline, 1);
  this.moveTo(0, 0);
  this.lineTo(this.options.width, 0);
  this.lineTo(this.options.width, this.options.height);
  this.lineTo(0, this.options.height);
  this.lineTo(0, 0);
}
