var InsurancePlz = InsurancePlz || {};

InsurancePlz.StackBox = function(game, x, y, options) {
    Phaser.Group.call(this, game);
    this.game = game;
    this.x = x;
    this.y = y;

    var opt = options || {
        width: 260,
        height: 57
    };

    this.add(new InsurancePlz.BackgroundBox(game, 0, 0, {
        background: 0x262626,
        opacity: 1,
        outline: 0xBBFA28,
        outlineThickness: 1,
        outlineOpacity: 1,
        width: opt.width,
        height: opt.height,
        margin: 3
    }));

    this.colors = [
        0xFFFF00,
        0x00FF00,
        0x0000FF,
        0xFF00FF,
        0x00FFFF,
        0xFF0000
    ]

    //create data
    var style = {
        color: 'white',
        // temp font, need to find font for commercial use
        font: '15px ZrNic',
        fill: '#fff',
        align: 'left',
        wordWrap: true,
        wordWrapWidth: 256
    };
    this.label = game.add.text(650, 330, '', style);
    this.stack = [];
};

InsurancePlz.StackBox.prototype = Object.create(Phaser.Group.prototype);
InsurancePlz.StackBox.prototype.constructor = InsurancePlz.StackBox;

/**
 * Callback function that removes the given attack from the attack stack.
 * @param {Object} button - The attack stack button that was pressed and will be deleted.
 */
InsurancePlz.StackBox.prototype.stackButton = function(button) {
    for (var i = 0; i < this.stack.length; i++) {
        if (this.stack[i].button === button) {
            this.clearAttack(i);
            return;
        }
    }
};

/**
 * Callback function that removes the given attack from the attack stack.
 * @param {Number} i - The attack stack index that was pressed and will be deleted.
 */
InsurancePlz.StackBox.prototype.clearAttack = function(i) {
    InsurancePlz.GameState.updateActionPoints(this.stack[i].attack.points);
    this.colors.push(this.stack[i].color);
    this.stack[i].destroy();
    this.stack.splice(i, 1);
    if (this.stack.length === 0) {
        this.label.text = '';
    } else {
        for (var j = 0; j < this.stack.length; j++) {
            this.stack[j].reposition(j);
        }
    }
};

/**
 * Adds a StackedAttack to the attackStack.
 * This function also checks whether the conditions to add the attack to the stack have been met and will provide error messages accordingly.
 * @param {Object} attack - The attack to be added to the stack.
 * @param {Object} target - The target of the attack.
 */
InsurancePlz.StackBox.prototype.stackAttack = function(attack, target) {
    //If the attack indicator exists, use its color.
    if (InsurancePlz.GameState.attackIndicator!=null){
        this.stack.push(
            new StackedAttack(
                attack, target, this.stack.length, InsurancePlz.GameState.attackIndicator.color, this.game, this.stackButton, this
            )
        );
    } else {
        this.stack.push(
            new StackedAttack(
                attack, target, this.stack.length, this.colors.pop(), this.game, this.stackButton, this
            )
        );
    }
    this.label.text = 'Stacked Attacks:';
};

/**
 * Function to check if given target already has an attack targetted at it.
 * @param {Number} target - the target id as shown in targets.json
 * @returns {Boolean} - True if its already in the stack, otherwise false
 */
InsurancePlz.StackBox.prototype.alreadyStackedForTarget = function(target) {
    for (var i = 0; i < this.stack.length; i++) {
        if (this.stack[i].target.data.id === target) {
            return true;
        }
    }
    return false;
};

/**
 * @returns {Boolean} - Whether this stack has reached the maximum allowed attacks as specified in GameState.gameProgress.
 */
InsurancePlz.StackBox.prototype.isFull = function(){
    return this.stack.length >= InsurancePlz.GameState.gameProgress.maxAttacks;
}

InsurancePlz.StackBox.prototype.update = function(){
    for (var i = 0; i < this.stack.length; i++) {
        if (this.stack[i].indicator.hasEnded()) {
            this.clearAttack(i--);
        } else {
            this.stack[i].update();
        }
    }
}
