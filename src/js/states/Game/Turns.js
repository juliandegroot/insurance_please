/**
 * Starts the next turn.
 * This will cause a game start message to show if it is the first turn,
 * or the news popup to be displayed when on later turns.
 */
 InsurancePlz.GameState.startTurn = function () {
    this.gameProgress.roundscore = 0; //set points back to zero
    //Pop up news message, fade out & make uninteractable rest of game
    if (this.gameProgress.newsarray === undefined || ((this.gameProgress.newsarray.length == 0) && (this.gameProgress.turn == 1))) {
        // start of the game or start of the tutorial from here:
        if (InsurancePlz.isTutorial == false) {
            this.popup = new Popup("Game Start", "There is no news today!\nHappy hacking!\nRemember.. if you are looking for some sort of manual on how to play, click on the big information icon on the lower right\nAll hackers start out gathering information..", 'popuppanel');
            this.popup.addButton("Let's begin!", this.closePopup, this);
        }
        if (InsurancePlz.isTutorial == true) {
            this.popup = new Popup("Tutorial Start", "Welcome to this tutorial. Your objective in this first round is to find the weak target!\nRemember.. if you are looking for some sort of manual on how to play, click on the big information icon on the lower right\nAll hackers start out gathering information..", 'popuppanel');
            this.popup.addButton("Let's begin!", this.closePopup, this);
        }
    } else { // we are beyond round 1 and therefore start off by showing the news
        var text = "THE NEWS\n";
        for (var i = 0; i < this.gameProgress.newsarray.length; i++) {
            var newsitem = this.gameProgress.newsarray[i];
            text += newsitem.body + "\n";
        }
        this.popup = new Popup("Turn " + this.gameProgress.turn + " News", text, 'popuppanel');
        if (InsurancePlz.isTutorial == true) { // if tutorial mode is on:
            this.popup.addButton("Close", this.closePopup_showTutorialRoundinfo, this); //close and give roundinfo popup
        } else { // no tutorial mode
            if (this.gameProgress.turn > 10) { // higher than endround?
                this.popup.addButton("Close", this.closePopup_endGame, this); //close and give endgame popup
            } // normal round
            else { this.popup.addButton("Close", this.closePopup, this); } //close
            
        }
        this.gameProgress.newsarray = [];
    }
    if (this.gameProgress.turn == 2) {
        // show a second attack to practice stacking:
        this.attacks.children[1].inputEnabled = true;
        this.attacks.children[1].visible = true;
    }

    // determine amount atckpnts available based on visible attacks (tut-mode)
    if (InsurancePlz.isTutorial) { // were in tutorial mode now
        this.givePoints();
    }
};

/**
 * Ends the current turn.
 * This means all stacked attacks will be executed and the stack cleared afterwards.
 * Events and new for the next round is generated.
 * If the conditions are met, the game will be ended.
 */
InsurancePlz.GameState.endTurn = function () {
    this.flushAttackStack(); // buttons on the right in panel
    var events = this.executeAttacks() // we are executing our attacks

    this.gameProgress.newsarray = this.gameProgress.newsarray.concat(this.newsbuilder.generateNewsItems(events));


    this.clearAttackStack(); // clear stacked attack array
    this.setAllButtonxAvailable(); // all button positions can be taken again
    this.gameProgress.index = 0;
    this.gameProgress.turn++;
    if (InsurancePlz.isTutorial == false) { // if were in tutorial mode we limit points
        this.gameProgress.actionPoints = this.gameProgress.actionPointsMax;
    }
    this.refreshStats(); // update stats

    //Trigger a minor event every turn (outside tutorial mode)
    if (InsurancePlz.isTutorial == false) {
        this.triggerMinorEvent();
    }
    //Trigger a major event every 5th turn (outside tutorial mode)
    if (InsurancePlz.isTutorial == false) {
        if (this.gameProgress.turn % 5 === 2) {
            this.triggerMajorEvent();
        }
    }
    console.log('It is now turn: ' + this.gameProgress.turn);
    //if ((this.gameProgress.turn > 2) && (InsurancePlz.isTutorial)) {
    //starttuttimer = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.endTutorial, this);
    //}


    // roundscore is positive and tutorial mode on , pass to next round is ok
    if ((this.gameProgress.roundscore > 0) && (InsurancePlz.isTutorial)) {
        this.popup = new Popup("Well Done!", "We will now show in a news bulletin what you have done!", 'popuppanel');
        this.popup.addButton("Show news", this.closePopupAndGiveNews, this);
    }
    // roundscore is zero! and tutorial mode on , pass to next round is NOT ok (player needs feedback)
    if ((this.gameProgress.roundscore == 0) && (InsurancePlz.isTutorial)) {
        console.log("newfwefwefwefd");
        this.gameProgress.turn--; //no round increase
        this.popup = new Popup("That's not good!", "You have done no damage. Try again by clicking on a target and looking at vulnerabilities", 'popuppanel');
        this.popup.addButton("Close", this.closePopup, this);
        this.givePoints(); //return points to try again
    }
    // roundscore is zero! and tutorial mode off , pass to next round is ok (feedback necessary?)
    if ((this.gameProgress.roundscore == 0) && (InsurancePlz.isTutorial == false)) {
        this.popup = new Popup("That's not good!", "You have done no damage. Maybe check the manual?", 'popuppanel');
        this.popup.addButton("Continue", this.closePopupAndGiveNews, this);
    }
    // roundscore is positive and tutorial mode off , pass to next round is ok
    if ((this.gameProgress.roundscore > 0) && (InsurancePlz.isTutorial == false)) {
        startruntimer = this.game.time.events.add(Phaser.Timer.SECOND, this.closePopupAndGiveNews, this);
    }
    //this.startTurn();

};

/**
 * Ends the current game.
 * For now, this means an unremovable popup will be created,
 * preventing the player from taking further actions.
 */
InsurancePlz.GameState.endGame = function() {
    this.popup = new Popup("Congratulations!", "You have reached the end of the.game!", 'popuppanel');
    this.popup.addButton("Close", this.loadMenu, this);
};

/**
 * Ends the tutorial.
 */
InsurancePlz.GameState.endTutorial = function () {
    this.popup = new Popup("Congratulations!", "You have reached the end of the tutorial", 'popuppanel');
    this.popup.addButton("Close", this.loadMenu, this);
};

/**
* Loads the menu.
*/
InsurancePlz.GameState.loadMenu = function () {
    this.state.start('Menu')
};

/**
* For tutorial mode to check points to spend.
*/
InsurancePlz.GameState.givePoints = function () {
    var points_to_spend = 0;
    for (var i = 0, len = this.attacks.children.length; i < len; i++) {
        if (this.attacks.children[i].visible == true) {
            points_to_spend = points_to_spend + this.attacks.children[i].getPoints();
        }
    }
    this.gameProgress.actionPoints = points_to_spend;
    this.refreshStats();
}

