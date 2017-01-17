var InsurancePlz = InsurancePlz || {};

/**
 * TODO: documentation. (0,0) point of the element is the point of the arrow!
 */
InsurancePlz.TargetInfoDisplay = function(game, parent, x, y, options) {
    Phaser.Group.call(this, game, parent);

    this.options = options || {
        background: 0xFF3300,
        outline: 0x0000FF,
        height: 200,
        width: 150,
        arrow: 5,
        padding: 5,
        style: {
            font: "bold 16px Arial",
            fill: "#fff",
            boundsAlignH: "left",
            boundsAlignV: "center",
            wordWrap: true
        }
    };

    this.x = x;
    this.y = y - this.options.height / 2;

    this.graphics = game.add.graphics(0, 0);
    this.add(this.graphics);
    this.drawGraphics();

    this.drawText(game);
    this.add(this.text);

    this.visible = false;
}

InsurancePlz.TargetInfoDisplay.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.TargetInfoDisplay.prototype.constructor = InsurancePlz.TargetInfoDisplay;

/**
 * Update the information that the display shows based on the provided target.
 * Changes the text to the target name, damage and vulnerable security measures.
 * @param {Object} target - The target to base the information on.
 */
InsurancePlz.TargetInfoDisplay.prototype.updateInfo = function(target) {
    this.text.text = "Targetname: " + target.data.name + "\nDamage: $" + target.data.damage + "\nVulnerabilities: \n" + this.getVulnerableString();
}

/**
 * Draw the graphics for the display. Consists of an outline and a background.
 */
InsurancePlz.TargetInfoDisplay.prototype.drawGraphics = function() {
    // Draw the background
    this.graphics.beginFill(this.options.background, 0.8);
    this.graphics.moveTo(0, this.options.height / 2);
    this.graphics.lineTo(this.options.arrow, this.options.height / 2 - this.options.arrow);
    this.graphics.lineTo(this.options.arrow, 0);
    this.graphics.lineTo(this.options.width, 0);
    this.graphics.lineTo(this.options.width, this.options.height);
    this.graphics.lineTo(this.options.arrow, this.options.height);
    this.graphics.lineTo(this.options.arrow, this.options.height / 2 + this.options.arrow);
    this.graphics.lineTo(0, this.options.height / 2);
    this.graphics.endFill();
    // Draw the outline
    this.graphics.lineStyle(2, this.options.outline, 1);
    this.graphics.moveTo(0, this.options.height / 2);
    this.graphics.lineTo(this.options.arrow, this.options.height / 2 - this.options.arrow);
    this.graphics.lineTo(this.options.arrow, 0);
    this.graphics.lineTo(this.options.width, 0);
    this.graphics.lineTo(this.options.width, this.options.height);
    this.graphics.lineTo(this.options.arrow, this.options.height);
    this.graphics.lineTo(this.options.arrow, this.options.height / 2 + this.options.arrow);
    this.graphics.lineTo(0, this.options.height / 2);
}

/**
 * Draw and set the text element parameters of the display.
 */
InsurancePlz.TargetInfoDisplay.prototype.drawText = function(game) {
    this.text = game.add.text(0, 0, "This is a a a a a a a a a a a aa test string\n - test item\n - test item 2\n - test item 3\n", this.options.style);
    this.text.setTextBounds(this.options.arrow + this.options.padding, 0 + this.options.padding, this.options.width - this.options.padding * 2 - this.options.arrow, this.options.height - this.options.padding * 2);
    this.text.wordWrapWidth = this.options.width - this.options.padding * 2 - this.options.arrow;
}

/**
 * Set the visibility of the TargetInfoDisplay to true. When set to show the
 * the element is drawn on screen.
 */
InsurancePlz.TargetInfoDisplay.prototype.show = function() {
    this.visible = true;
}

/**
 * Set the visibility of the TargetInfoDisplay to false. When set to hide the
 * element is not drawn on screen.
 */
InsurancePlz.TargetInfoDisplay.prototype.hide = function() {
    this.visible = false;
}

/**
 * Toggle the visibility of the TargetInfoDisplay. When visible it is set to
 * hide, when invisible it is set to show.
 */
InsurancePlz.TargetInfoDisplay.prototype.toggle = function() {
    this.visible = !this.visible;
}