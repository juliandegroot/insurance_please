/**
 * Makes current selected attack (sprite) transparant and deselects previously selected attacks
 * @param {object} attack The attack we select
 */
InsurancePlz.GameState.selectAttack = function(attack) {
    if (this.selectedAttack != attack) {
        this.clearAttackSelection();
        this.destroyAttackIndicator();
        this.selectedAttack = attack;
        this.selectedAttack.alpha = 0.5;
    } else {
        this.clearAttackSelection();
    }
};

/**
 * Clears the selected attack and resets the alpha on all attack buttons.
 */
InsurancePlz.GameState.clearAttackSelection = function() {
    this.selectedAttack = undefined;
    this.attackBox.resetAlpha();
};

/**
 * Adds a StackedAttack to the attackStack.
 * This function also checks whether the conditions to add the attack to the stack have been met and will provide error messages accordingly.
 * @param {Object} attack - The attack to be added to the stack.
 * @param {Object} target - The target of the attack.
 */
InsurancePlz.GameState.stackAttack = function(attack, target) {
    //If we don't have enough points to add that attack...
    if (attack.data.points > this.gameProgress.actionPoints) {
        reg.modal.showModal("not-enough-action-points");
        this.clearAttackSelection();
        return;
    }

    //If the target already has an attack aimed at it...
    if (this.stackBox.alreadyStackedForTarget(target.data.id)) {
        reg.modal.showModal("already-stacked-for-target");
        this.clearAttackSelection();
        return;
    }

    //If we already have the maximum amount of attacks stacked...
    if (this.stackBox.isFull()) {
        reg.modal.showModal("stack-full");
        this.clearAttackSelection();
        return;
    }

    //If all requirements are met, we add the attack to the stack
    this.updateActionPoints(-attack.data.points);
    this.stackBox.stackAttack(attack, target);
    this.clearAttackSelection();

    //Erase indicator to avoid the re-addition of the same color
    this.attackIndicator.destroy();
    this.attackIndicator = undefined;
};

/**
 * Performs all attacks on the attackStack and creates corresponding news items.
 * @returns {Object[]} - An array containing all news items generated from the attacks.
 */
InsurancePlz.GameState.executeAttacks = function() {
    var news = [];
    for (var i = 0; i < this.stackBox.stack.length; i++) {
        var item = this.stackBox.stack[i].execute();
        if (item.damage > 0) {
            news.push(item);
            // check damage done per round for tutorial purpose
            this.gameProgress.roundscore = this.gameProgress.roundscore + item.damage; 
        }
    }
    return news;
};

/**
 * Triggers an update for all attack indicator animations.
 */
InsurancePlz.GameState.updateAttackIndicators = function() {
    //Update the selected attack
    if (this.selectedAttack !== undefined) {
        if (this.attackIndicator !== undefined) {
            this.attackIndicator.update();
        } else {
            this.attackIndicator = new Indicator({
                "source": this.selectedAttack,
                "target": this.game.input,
                "sourceOffsetX": this.selectedAttack.width / 2,
                "color": this.stackBox.colors.pop()
            }, this);
        }
    } else if (this.attackIndicator !== undefined) {
        this.stackBox.colors.push(this.attackIndicator.color);
        this.attackIndicator.destroy();
        this.attackIndicator = undefined;
    }
};

/**
 * Destroys the attack indicator and returns the color to the list of available colors.
 */
InsurancePlz.GameState.destroyAttackIndicator = function() {
    if (this.attackIndicator!==undefined){
        this.stackBox.colors.push(this.attackIndicator.color);
        this.attackIndicator.destroy();
        this.attackIndicator = undefined;
    }
};