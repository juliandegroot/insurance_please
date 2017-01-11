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

/**
 * Returns available an available x coordinate from the buttonstack
 * where we are dealing with a 2dimensional array : [[650, false],..]
 * so the next stacked attack can be placed on that position
 * @returns {number} - available x coordinate
 */
InsurancePlz.GameState.giveAvailableButtonx = function() {
    //console.log(this.gameProgress.buttonstack);
    for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
        if (this.gameProgress.buttonstack[i][1] == false) { // if the 2nd element is false we can place
            return this.gameProgress.buttonstack[i][0]; // return first available x
        }
    }
};

/**
 * Checks if all positions for stacked attack buttons in UI are available
 * If not we can update UI to show no more text in stackboxtext.text
 * @returns {boolean} - true
 */
InsurancePlz.GameState.checkAllButtonsAvailable = function() {
    for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
        if (this.gameProgress.buttonstack[i][1] != false) {
            return true; // 1 or more attacks are stacked
        }
    }
    return false; // no attacks are currently stacked
};

InsurancePlz.GameState.setButtonxTaken = function(coordx) {
    for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
        if (this.gameProgress.buttonstack[i][0] == coordx) {
            this.gameProgress.buttonstack[i][1] = true; // taken

        }
    }
};

InsurancePlz.GameState.setButtonxAvailable = function(coordx) {
    for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
        if (this.gameProgress.buttonstack[i][0] == coordx) {
            this.gameProgress.buttonstack[i][1] = false; // taken

        }
    }
};

InsurancePlz.GameState.setAllButtonxAvailable = function() { // at round end
    for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
        this.gameProgress.buttonstack[i][1] = false; // taken
    }
};

InsurancePlz.GameState.stackAttack = function(target, attack, sprite) {
    this.gameProgress.attackstack.push([target, attack]);
    var spritename = sprite + '_small';
    //under here we have to check in some sort of array if on all possible x's 650,700,750,800,850 there is a true or false
    // to know whether , check for first false x in buttonstack and return that so we can use it here
    //if (this.gameProgress.buttonstack)
    var newx = this.giveAvailableButtonx();
    this.stackbutton = this.add.button(newx, 350, spritename, this.removeFromStack, this);
    this.setButtonxTaken(newx); // set previously given out button position as taken
    //this.stackbutton.input.enabled = false;
    this.stackbutton.targetid = target.getID();
    this.stackbutton.targetname = target.getName();
    this.stackbutton.attackpoints = attack.getPoints();
    this.stackbutton.attackid = attack.getID();
    this.stackbutton.xcoord = newx;
    var newy = this.stackbutton.y;
    var scorestyle = {
        color: 'red',
        // temp font, need to find font for commercial use
        font: '15px ZrNic',
        fill: '#f00',
        align: 'left',
        wordWrap: true,
        wordWrapWidth: 256
    };


    this.gameProgress.index += 50;
    this.stackedattacks.add(this.stackbutton);
    this.stackboxtext.text = 'Stacked Attacks:';

    if (newx == 650) {
        stackText1.y = newy + 45;
        stackText1.text = this.stackbutton.targetname;
    }
    if (newx == 700) {
        stackText2.y = newy + 45;
        stackText2.text = this.stackbutton.targetname;
    }
    if (newx == 750) {
        stackText3.y = newy + 45;
        stackText3.text = this.stackbutton.targetname;
    }
    if (newx == 800) {
        stackText4.y = newy + 45;
        stackText4.text = this.stackbutton.targetname;
    }
    if (newx == 850) {
        stackText5.y = newy + 45;
        stackText5.text = this.stackbutton.targetname;
    }
    this.game.world.bringToTop(stackText1);
    this.game.world.bringToTop(stackText2);
    this.game.world.bringToTop(stackText3);
    this.game.world.bringToTop(stackText4);
    this.game.world.bringToTop(stackText5);
};

InsurancePlz.GameState.removeFromStack = function(button) {
    for (var i = this.gameProgress.attackstack.length-1; i >= 0; i--) {
        var targetid = this.gameProgress.attackstack[i][0].getID();
        var attackid = this.gameProgress.attackstack[i][1].getID();
        //console.log(targetid);
        if (targetid == button.targetid && attackid == button.attackid) {
            this.gameProgress.attackstack.splice(i, 1); // hier gaat ie mis want pop(i)
            this.setButtonxAvailable(button.xcoord);
            if (button.xcoord == 650) {
                stackText1.text = '';
            }
            if (button.xcoord == 700) {
                stackText2.text = '';
            }
            if (button.xcoord == 750) {
                stackText3.text = '';
            }
            if (button.xcoord == 800) {
                stackText4.text = '';
            }
            if (button.xcoord == 850) {
                stackText5.text = '';
            }
            button.destroy();
            this.gameProgress.actionPoints += button.attackpoints;
            this.refreshStats();
        }
    }
    if (this.checkAllButtonsAvailable() == false) { // no attacks are currently stacked
        this.stackboxtext.text = '';
    }
};

InsurancePlz.GameState.flushAttackStack = function() {
    for (var i = this.gameProgress.attackstack.length-1; i >= 0; i--) {
        this.stackedattacks.children[i].destroy();
    }
    this.stackboxtext.text = '';
    stackText1.text = '';
    stackText2.text = '';
    stackText3.text = '';
    stackText4.text = '';
    stackText5.text = ''
};

/**
 * Makes the gameProgress attackstack empty.
 */
InsurancePlz.GameState.clearAttackStack = function() {
    this.gameProgress.attackstack = [];
};

InsurancePlz.GameState.executeAttacks = function() {
    // for each target and attack combination in the attackstack array:
    var events = [];
    for (var i = 0; i < this.gameProgress.attackstack.length; i++) {
        var target = this.gameProgress.attackstack[i][0];
        var attack = this.gameProgress.attackstack[i][1];
        var info = target.doDamage(attack.getSecmeasure(), attack.getEffect(), attack.id, attack.getName(), target.getName(), target);
        if (info.damage > 0) {
            events.push(info);
            this.gameProgress.roundscore = this.gameProgress.roundscore + info.damage; // check damage done per round for tutorial purpose
        }
    }
    return events;
};

/**
 * Function to generate news items as JSON objects to be put in newsarray
 * which is part of the game's gameProgress object
 * @param {number} damagedone     - the damage inflicted
 * @param {string} attackname     - the name of the attack
 * @param {string} targetname     - the name of the target (company)
 * @param {string} targetcategory - the type of target (i.e. bank, insurance)
 */
InsurancePlz.GameState.generateAttackNewsItem = function(damagedone, attackname, targetname, targetcategory) {
    var nheadline = "Target " + targetname + " suffered from " + attackname;
    var nbody = "Over the last 24 hours " + targetcategory + " company " + targetname + " suffered from " + attackname + ".\nIt is estimated damage is done for $" + damagedone + ".";
    var newsitem = {
        round: this.gameProgress.turn,
        type: "attack",
        headline: nheadline,
        body: nbody
    };
    this.gameProgress.newsarray.push(newsitem);
    //this.showNews();
};

/**
 * Function to check if given attack is already in this round stack for given target
 * @param   {number}  target_id - the target id as shown in targets.json
 * @param   {number}  attack_id - the attack id as shown in europe.json
 * @returns {boolean} showing true if its already in the stack, otherwise false
 */
InsurancePlz.GameState.alreadyStackedForTarget = function(target_id, attack_id) {
    for (var i = 0; i < this.gameProgress.attackstack.length; i++) {
        var target = this.gameProgress.attackstack[i][0];
        var attack = this.gameProgress.attackstack[i][1];
        var tar_id = target.getID();
        var atk_id = attack.getID();
        if (tar_id == target_id && atk_id == attack_id) {
            console.log("Combination already stacked! Tar_id: " + tar_id + " Atk_id: " + atk_id);
            this.showModalAlreadyStacketforTarget();
            this.clearAttackSelection(); // deselect attack
            return true
        }
    }
    return false;
};

/**
 * TODO: remove: only usefull for debugging.
 * Help function to show all news items from gameProgress newsarray
 */
InsurancePlz.GameState.showNews = function() {
    console.log("All the news:")
    for (var i = 0; i < this.gameProgress.newsarray.length; i++) {
        var newsitem = this.gameProgress.newsarray[i];
        console.log(newsitem);
    }
};

InsurancePlz.GameState.enoughPoints = function(attackweight) {
    if (this.gameProgress.actionPoints - attackweight < 0) {
        console.log("Cannot stack, not enough points : " + this.gameProgress.actionPoints + " " + attackweight);
        this.showModalNotEnoughAttackPoints();
        this.clearAttackSelection(); // deselect attack
        return false;
    }
    return true;
};
