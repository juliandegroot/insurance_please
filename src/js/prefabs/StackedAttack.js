/**
 * Creates a stacked attack. Automatically creates and positions the button and indicator.
 * @constructor
 * @param {Object} attack - The attack to stack.
 * @param {Object} target - The target for the attack.
 * @param {Number} position - The position index for this stacked attack.
 * @param {Number} color - The color to use for the indicator.
 * @param {Object} game - A reference to the ongoing game.
 * @param {Function} callback - A callback for when the button is clicked.
 * @param {Object} context - The context for the callback.
 */
function StackedAttack(attack, target, position, color, game, callback, context) {
    this.attack = attack;
    this.target = target;
    this.color = color;
    this.button = game.add.button(this.getX(position), 550, attack.data.asset + "_small", callback, context);
    this.indicator = new Indicator({
        "source":this.button,
        "target":this.target,
        "sourceOffsetX":this.button.width/2,
        "sourceOffsetY":this.button.height/2,
        "color":this.color
    }, game);
}

/**
 * Updates any elements of this attack that need to be updated.
 */
StackedAttack.prototype.update = function() {
    this.indicator.update();
}

/**
 * Shorthand function for causing this attack to be executed.
 */
StackedAttack.prototype.execute = function() {
    this.indicator.execute();
    return this.target.doDamage(this.attack);
}

/**
 * Positions the sprite elements of this stacked attack to a new position index.
 */
StackedAttack.prototype.reposition = function(position) {
    this.button.x = this.getX(position);
};

/**
 * Remove this stacked attack and all sprite elements connected with it.
 */
StackedAttack.prototype.destroy = function() {
    this.button.destroy();
    if (!this.indicator.ending){
        this.indicator.destroy();
    }
};

/**
 * @param {Number} - The index of this stacked attack in the list.
 * @returns {Number} - The X position for this index.
 */
StackedAttack.prototype.getX = function(position) {
    return 1025 + 50 * position;
};