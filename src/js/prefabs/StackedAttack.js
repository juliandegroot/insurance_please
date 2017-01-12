/**
 * Creates a stacked attack. Automatically creates and positions the button and text.
 * @constructor
 * @param {Object} attack - The attack to stack.
 * @param {Object} target - The target for the attack.
 * @param {Number} position - The position index for this stacked attack.
 */
function StackedAttack(attack, target, position, game) {
    this.attack = attack;
    this.target = target;
    this.button = game.add.button(this.getX(position), 350, attack.data.asset + "_small", game.clearAttack, game);
    var style = {
        color: 'yellow',
        // temp font, need to find font for commercial use
        font: '15px ZrNic',
        fill: '#ffff00',
        align: 'left',
        wordWrap: true,
        wordWrapWidth: 50
    };
    this.label = game.add.text(this.getX(position), 395, target.data.name, style);
}

/**
 * Shorthand function for causing this attack to be executed.
 */
StackedAttack.prototype.execute = function(){
    return this.target.doDamage(this.attack);
}

/**
 * Positions the sprite elements of this stacked attack to a new position index.
 */
StackedAttack.prototype.reposition = function(position) {
    this.button.x = this.getX(position);
    this.label.x = this.getX(position);
};

/**
 * Remove this stacked attack and all sprite elements connected with it.
 */
StackedAttack.prototype.destroy = function() {
    this.button.destroy();
    this.label.destroy();
};

StackedAttack.prototype.getX = function(position){
    return 650+50*position;
};