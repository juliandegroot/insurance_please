InsurancePlz = InsurancePlz || {};

/**
 * Predefined graphics which draws itself. Draws a box with an outline.
 * //TODO: parameters documentation
 */
InsurancePlz.BackgroundBox = function(game, x, y, options) {
  Phaser.Graphics.call(this, game, x, y);
  // Use the options or the default options when undefined
  var opt = options || {
    background: 0xFF3300,
    opacity: 1,
    outline: 0x0000FF,
    outlineThickness: 2,
    outlineOpacity: 1,
    height: 600,
    width: 500,
    margin: 5
  }
  // Draw the elements
  this.drawBackground(opt);
  this.drawOutline(opt);
}

InsurancePlz.BackgroundBox.prototype = Object.create(Phaser.Graphics.prototype);
InsurancePlz.BackgroundBox.prototype.constructor = InsurancePlz.BackgroundBox;

/**
 * Draw the background box for the element.
 * @param {Object} options - The options ot use to draw the background.
 */
InsurancePlz.BackgroundBox.prototype.drawBackground = function(options) {
  this.beginFill(options.background, options.opacity);
  this.drawRect(0, 0, options.width, options.height);
  this.endFill();
}

/**
 * Draw the outline of the element.
 * @param {Object} options - The options to use to draw the line.
 */
InsurancePlz.BackgroundBox.prototype.drawOutline = function(options) {
  this.lineStyle(options.outlineThickness, options.outline, options.outlineOpacity);
  this.moveTo(options.margin, options.margin);
  this.lineTo(options.width - options.margin, options.margin);
  this.lineTo(options.width - options.margin, options.height - options.margin);
  this.lineTo(options.margin, options.height - options.margin);
  this.lineTo(options.margin, options.margin);
}
