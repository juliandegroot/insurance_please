/**
 * Starts the next turn.
 * This will cause a game start message to show if it is the first turn,
 * or the news popup to be displayed when on later turns.
 */
 InsurancePlz.GameState.startTurn = function () {
    this.gameProgress.roundscore = 0; //set points back to zero
    if (InsurancePlz.isTutorial == false) {
        this.updateActionPoints(this.gameProgress.actionPointsMax); //reset action points
    }
    //Pop up news message, fade out & make uninteractable rest of game
    if (this.gameProgress.newsarray === undefined || ((this.gameProgress.newsarray.length == 0) && (this.gameProgress.turn == 1))) {
        // start of the game or start of the tutorial from here:
        if (InsurancePlz.isTutorial == false) {
            this.popup = new Popup("Game Start", "There is no news today!\nHappy hacking!\nRemember.. if you are looking for some sort of manual on how to play, click on the big information icon on the lower right\nAll hackers start out gathering information..", 'popuppanel');
            this.popup.addButton("Let's begin!", this.closePopup, this);
        }
        if (InsurancePlz.isTutorial == true) {
            this.popup = new Popup("Tutorial Start", "Welcome to this tutorial.\n You are a hacker, your job is to do as much damage as possible to companies!\n\nYou will play 2 rounds to learn how to execute single and multiple attacks.\n Round 1: Find the weak target and attack it!\n Round 2: Align attacks for both targets.\n\nRemember, if you are looking for information on vulnerabilities, attacks or how to play, click on the help button in the lower right.\nAll hackers start out gathering information...", 'popuppanel');
            this.popup.addButton("Let's begin!", this.closePopupAndShowInstructions, this);
        }
    } else { // we are beyond round 1 and therefore start off by showing the news
        var headlines = [];
        var texts = [];
        for (var i = 0; i < this.gameProgress.newsarray.length; i++) {
            if (this.gameProgress.newsarray[i].body!=""){
                headlines.push(this.gameProgress.newsarray[i].headline);
                texts.push(this.gameProgress.newsarray[i].body);
            }
        }
        if (texts.length!==0){
            this.popup = new Popup(headlines, texts, 'popuppanel');
            if (InsurancePlz.isTutorial) { // if tutorial mode is on:
                this.popup.addButton("Close", this.closePopup_showTutorialRoundinfo, this);
            } else if (this.gameProgress.turn > this.gameProgress.maxTurns) { // higher than endround?
                this.popup.addButton("Close", this.closePopup_endGame, this);
            } else { //normal round
                this.popup.addButton("Close", this.closePopup, this);
            }
        }
        this.gameProgress.newsarray = [];
    }
    if (this.gameProgress.turn == 2 && InsurancePlz.isTutorial) {
        // show a second attack to practice stacking:
        this.attackBox.attacks.children[1].inputEnabled = true;
        this.attackBox.attacks.children[1].visible = true;
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
    var events = this.executeAttacks(); // we are executing our attacks

    this.gameProgress.newsarray = this.gameProgress.newsarray.concat(this.newsbuilder.generateNewsItems(events));

    this.gameProgress.index = 0;
    this.gameProgress.turn++;
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

    // roundscore is positive and tutorial mode on , pass to next round is ok
    if ((this.gameProgress.roundscore > 0) && (InsurancePlz.isTutorial)) {
        this.popup = new Popup("Well Done!", "We will now show in a news bulletin what you have done!", 'popuppanel');
        this.popup.addButton("Show news", this.closePopupAndGiveNews, this);
    }
    // roundscore is zero! and tutorial mode on , pass to next round is NOT ok (player needs feedback)
    if ((this.gameProgress.roundscore == 0) && (InsurancePlz.isTutorial)) {
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

};

/**
 * Ends the current game.
 * For now, this means an unremovable popup will be created,
 * preventing the player from taking further actions.
 */
InsurancePlz.GameState.endGame = function() {
    this.popup = new Popup("Congratulations!", "You have reached the end of the.game! If you wish, you may submit your highscore to the leaderboard.", 'popuppanel');
    this.popup.addButton("Close", this.submitLeaderboard, this);
};

/**
 * Opens the leaderboard submission window.
 */
InsurancePlz.GameState.submitLeaderboard = function() {
    this.popup.destroy();
    this.highscoreBox = new InsurancePlz.HighscoreBox(this);
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
    document.getElementById('game-music').pause();
    document.getElementById('game-music').currentTime = 0;
    this.state.start('Menu');
};

/**
* For tutorial mode to check points to spend.
*/
InsurancePlz.GameState.givePoints = function () {
    var points_to_spend = 0;
    for (var i = 0, len = this.attackBox.attacks.children.length; i < len; i++) {
        if (this.attackBox.attacks.children[i].visible == true) {
            points_to_spend = points_to_spend + this.attackBox.attacks.children[i].getPoints();
        }
    }
    this.gameProgress.actionPoints = points_to_spend;
    this.refreshStats();
    return points_to_spend;
}
