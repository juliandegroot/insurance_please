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

InsurancePlz.GameState.clearAttackSelection = function() {
    this.selectedAttack = null;
    this.attacks.setAll('alpha', 1);
};

InsurancePlz.GameState.clearAttack = function(elem){
    for (var i=0;i<this.attackStack.length;i++){
        if (this.attackStack[i].button===elem){
            this.gameProgress.actionPoints += this.attackStack[i].attack.points;
            this.attackStack[i].destroy();
            this.attackStack.splice(i, 1);
            if (this.attackStack.length===0){
                this.attackStackLabel.text = '';
            } else {
                for (var j=0;j<this.attackStack.length;j++){
                    this.attackStack[j].reposition(j);
                }
            }
            break;
        }
    }
}

InsurancePlz.GameState.stackAttack = function(target, attack) {
    this.gameProgress.actionPoints -= attack.data.points;
    this.attackStack.push(
        new StackedAttack(
            attack, target, this.attackStack.length, this
        )
    );
    this.attackStackLabel.text = 'Stacked Attacks:';
};

InsurancePlz.GameState.flushAttackStack = function() {
    for (var i=0;i<this.attackStack.length;i++){
        this.attackStack[i].destroy();
    }
    this.attackStack = [];
    this.attackStackLabel.text = '';
};

/**
 * Performs all attacks on the attackStack and creates corresponding news items.
 * @returns {Object[]} - An array containing all news items generated from the attacks.
 */
InsurancePlz.GameState.executeAttacks = function() {
    var news = [];
    for (var i=0;i<this.attackStack.length;i++){
        var item = this.attackStack[i].execute();
        if (item.damage > 0) {
            news.push(item);
        }
    }
    return news;
};

/**
 * Function to check if given target already has an attack targetted at it.
 * @param   {Number} target - the target id as shown in targets.json
 * @returns {Boolean} - True if its already in the stack, otherwise false
 */
InsurancePlz.GameState.alreadyStackedForTarget = function(target) {
    for (var i=0;i<this.attackStack.length;i++){
        if (this.attackStack[i].target.data.id === target){
            return true;
        }
    }
    return false;
};

InsurancePlz.GameState.enoughPoints = function(attackCost) {
    return this.gameProgress.actionPoints >= attackCost;
};
