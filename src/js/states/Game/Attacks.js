/**
 * Makes current selected attack (sprite) transparant and deselects previously selected attacks
 * @param {object} attack The attack we select
 */
InsurancePlz.GameState.selectAttack = function(attack) {
    if (this.selectedAttack != attack) {
        this.clearAttackSelection();
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
    this.attacks.setAll('alpha', 1);
};


/**
 * Callback function that removes the given attack from the attack stack.
 * @param {Object} button - The attack stack button that was pressed and will be deleted.
 */
InsurancePlz.GameState.clearAttack = function(button) {
    for (var i = 0; i < this.attackStack.length; i++) {
        if (this.attackStack[i].button === button) {
            this.updateActionPoints(-this.attackStack[i].attack.points);
            this.attackStack[i].destroy();
            this.attackStack.splice(i, 1);
            if (this.attackStack.length === 0) {
                this.attackStackLabel.text = '';
            } else {
                for (var j = 0; j < this.attackStack.length; j++) {
                    this.attackStack[j].reposition(j);
                }
            }
            break;
        }
    }
};

/**
 * Callback function that removes the given attack from the attack stack.
 * @param {Object} button - The attack stack button that was pressed and will be deleted.
 */
InsurancePlz.GameState.stackButton = function(button) {
    for (var i = 0; i < this.attackStack.length; i++) {
        if (this.attackStack[i].button === button) {
            this.clearAttack(i);
            return;
        }
    }
};

/**
 * Callback function that removes the given attack from the attack stack.
 * @param {Object} button - The attack stack butt++)on that was pressed and will be deleted.
 */
InsurancePlz.GameState.clearAttack = function(i) {
    this.updateActionPoints(this.attackStack[i].attack.points);
    this.attackStack[i].destroy();
    this.attackStack.splice(i, 1);
    if (this.attackStack.length === 0) {
        this.attackStackLabel.text = '';
    } else {
        for (var j = 0; j < this.attackStack.length; j++) {
            this.attackStack[j].reposition(j);
        }
    }
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
    if (this.alreadyStackedForTarget(target.data.id)) {
        reg.modal.showModal("already-stacked-for-target");
        this.clearAttackSelection();
        return;
    }

    //If we already have the maximum amount of attacks stacked...
    if (this.attackStack.length >= this.gameProgress.maxAttacks) {
        reg.modal.showModal("stack-full");
        this.clearAttackSelection();
        return;
    }

    //If all requirements are met, we add the attack to the stack
    this.gameProgress.actionPoints -= attack.data.points;
    this.attackStack.push(
        new StackedAttack(
            attack, target, this.attackStack.length, this
        )
    );
    this.attackStackLabel.text = 'Stacked Attacks:';

    this.clearAttackSelection();
    this.refreshStats();
};

/**
 * Removes all attacks from the attack stack and cleans up elements accordingly.
 */
InsurancePlz.GameState.flushAttackStack = function() {
    for (var i = 0; i < this.attackStack.length; i++) {
        if (!this.attackStack[i].indicator.ending) {
            this.clearAttack(i--)
        }
    }
};

/**
 * Performs all attacks on the attackStack and creates corresponding news items.
 * @returns {Object[]} - An array containing all news items generated from the attacks.
 */
InsurancePlz.GameState.executeAttacks = function() {
    var news = [];
    for (var i = 0; i < this.attackStack.length; i++) {
        var item = this.attackStack[i].execute();
        if (item.damage > 0) {
            news.push(item);
            // check damage done per round for tutorial purpose
            this.gameProgress.roundscore = this.gameProgress.roundscore + item.damage; 
        }
    }
    return news;
};

/**
 * Function to check if given target already has an attack targetted at it.
 * @param {Number} target - the target id as shown in targets.json
 * @returns {Boolean} - True if its already in the stack, otherwise false
 */
InsurancePlz.GameState.alreadyStackedForTarget = function(target) {
    for (var i = 0; i < this.attackStack.length; i++) {
        if (this.attackStack[i].target.data.id === target) {
            return true;
        }
    }
    return false;
};

/**
 * Triggers an update for all attack indicator animations.
 */
InsurancePlz.GameState.updateAttackIndicators = function() {
    //Update the stack
    for (var i = 0; i < this.attackStack.length; i++) {
        if (this.attackStack[i].indicator.hasEnded()) {
            this.clearAttack(i--);
        } else {
            this.attackStack[i].update();
        }
    }

    //Update the selected attack
    if (this.selectedAttack !== undefined) {
        if (this.attackIndicator !== undefined) {
            this.attackIndicator.update();
        } else {
            this.attackIndicator = new Indicator({
                "source": this.selectedAttack,
                "target": this.game.input,
                "sourceOffsetX": this.selectedAttack.width / 2
            }, this);
        }
    } else if (this.attackIndicator !== undefined) {
        this.attackIndicator.destroy();
        this.attackIndicator = undefined;
    }
}