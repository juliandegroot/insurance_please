var InsurancePlz = InsurancePlz || {};
var reg = {};

/**
 * The base GameState Prototype contains only the base Phaser functions.
 * Its prototype is extended upon by numerous files within the 'Game' folder.
 */
InsurancePlz.GameState = {
    init: function () {
        this.gameProgress = {
            "turn": 1,
            "actionPoints": 10,
            "actionPointsMax": 10,
            "score": 0,
            "maxAttacks": 5,
            "roundscore": 0,
            "newsarray": []
        };

        this.majorEventList = createMajorEventsFromJSON(this.game.cache.getText('major_events'));
        this.minorEventList = createMinorEventsFromJSON(this.game.cache.getText('minor_events'));
        this.newsbuilder = new InsurancePlz.NewsItemBuilder(JSON.parse(this.game.cache.getText('news')));
    },
    create: function () {
        this.createUI();
        var style = {
            color: 'white',
            // temp font, need to find font for commercial use
            font: '15px ZrNic',
            fill: '#fff',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256
        };
        var scorestyle = {
            color: 'red',
            // temp font, need to find font for commercial use
            font: '30px ZrNic',
            fill: '#f00',
            align: 'right',
            wordWrap: true,
            wordWrapWidth: 256
        };
        var acpointsstyle = {
            color: 'yellow',
            // temp font, need to find font for commercial use
            font: '30px ZrNic',
            fill: '#f0f',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256
        };
        var stackstyle = {
            color: 'yellow',
            // temp font, need to find font for commercial use
            font: '15px ZrNic',
            fill: '#ffff00',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 50
        };
        var secmstyle = {
            color: 'yellow',
            // temp font, need to find font for commercial use
            font: '15px ZrNic',
            fill: '#ffff00',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256
        };

        //newspanel area
        this.newspanel = this.add.sprite(640, 0, 'newspanel');
        this.newspanelLabel = this.add.text(644, 15, '', style);
        //this.securedpanelLabel = this.add.text(644, 100, '', secmstyle);
        this.vulnerablepanelLabel = this.add.text(644, 90, '', secmstyle);

        //loading the map with targets and attacks
        this.createMap();
        this.refreshStats();

        //start turn:
        this.startTurn();

        //modal setup:
        reg.modal = new gameModal(this.game);
        this.createModals();

        //tutorial things:

        /*in the following for-loop we iterate over the visible items and
        give attackpoints equal to that of the points needed of the visible attack, in round 1 that will be only points for 1 attack and in round 2 points for exactly those 2 attacks .. */
        if (InsurancePlz.isTutorial) {
            this.givePoints();
        }
    },
    update: function(){
        this.updateAttackIndicators();
    }
};

/**
 * Below are a number of functions with no clear category.
 */
InsurancePlz.GameState.updateNews = function(news) {
    this.newspanelLabel.text = news;
};

InsurancePlz.GameState.refreshStats = function() {
    var total = 0
    for (var k in this.attackMapData.targets) { // getting the actual array
        for (var l in this.attackMapData.targets[k]) {
            if (l == "damage") {
                total = total + this.attackMapData.targets[k][l];
            }
        }
    }
    this.gameProgress.score = total;
    this.informationBox.updateAttackPoints(this.gameProgress.actionPoints);
    this.informationBox.updateDamage(this.gameProgress.score);
};

/**
 * Function to close current popup by destroying it.
 */
InsurancePlz.GameState.closePopup = function() {
    this.popup.destroy();
};

/**
 * Function to close current popup and start a turn to give news
 */
InsurancePlz.GameState.closePopupAndGiveNews = function() {
    this.popup.destroy();
    this.startTurn();
};

/**
 * Function to close current popup and follow execution of the endgame
 */
InsurancePlz.GameState.closePopup_endGame = function() {
    this.popup.destroy();
    this.endGame();
};

/**
 * Function to close current popup and show tutorial roundinfo
 */
InsurancePlz.GameState.closePopup_showTutorialRoundinfo = function () {
    this.popup.destroy();
    if (this.gameProgress.turn == 2) {
        this.popup = new Popup("Go big or go home!", "Show your skills and execute multiple attacks at once!\n. Go ahead!", 'popuppanel');
        this.popup.addButton("Continue", this.closePopup, this);
    }
    if (this.gameProgress.turn == 3) { //end of the tutorial is reached
        this.endTutorial();
    }
};

/**
 * Grants the given amount of action points and refreshes the UI.
 * Does not allow more than the maximum amount of action points to be gained.
 */
InsurancePlz.GameState.updateActionPoints = function(amount){
    this.gameProgress.actionPoints = Math.max(Math.min(this.gameProgress.actionPoints + amount, this.gameProgress.actionPointsMax), 0);
    this.refreshStats();
};
