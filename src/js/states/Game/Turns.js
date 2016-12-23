InsurancePlz.GameState.startTurn = function () {
    //Pop up news message, fade out & make uninteractable rest of game
    if (this.gameProgress.newsarray === undefined || this.gameProgress.newsarray.length == 0) {
        this.popup = new Popup("Game Start", "There is no news today!\nHappy hacking!\nRemember.. if you are looking for some sort of manual on how to play, click on the big information icon on the lower right\nAll hackers start out gathering information..", 'popuppanel');
        this.popup.addButton("Let's begin!", this.closePopup, this);
    } else {
        var text = "THE NEWS\n";
        for (var i = 0; i < this.gameProgress.newsarray.length; i++) {
            var newsitem = this.gameProgress.newsarray[i];
            text += newsitem.body + "\n";
        }
        this.popup = new Popup("Turn " + this.gameProgress.turn + " News", text, 'popuppanel');
        this.popup.addButton("Close", this.closePopup, this);
        this.gameProgress.newsarray = [];
    }
};

InsurancePlz.GameState.endTurn = function () {
    this.flushAttackStack(); // buttons on the right in panel
    var events = this.executeAttacks() // we are executing our attacks

    this.gameProgress.newsarray = this.gameProgress.newsarray.concat(this.newsbuilder.generateNewsItems(events));


    this.clearAttackStack(); // clear stacked attack array
    this.setAllButtonxAvailable(); // all button positions can be taken again
    this.gameProgress.index = 0;
    this.gameProgress.turn++;
    this.gameProgress.actionPoints = this.gameProgress.actionPointsMax;
    this.refreshStats(); // update stats

    //Trigger a minor event every turn
    this.triggerMinorEvent();
    //Trigger a major event every 5th turn
    if (this.gameProgress.turn%5===2){
        this.triggerMajorEvent();
    }

    console.log('It is now turn: ' + this.gameProgress.turn);
    if (this.gameProgress.turn > 10) {
        this.endGame();
    } else {
        startruntimer = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startTurn, this);
        //this.startTurn();
    }
};

InsurancePlz.GameState.endGame = function() {
    this.popup = new Popup("Congratulations!", "You have reached the end of the.game!",'popuppanel');
};
