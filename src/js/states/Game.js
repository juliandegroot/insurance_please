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
            "maxTurns": 10,
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
        
        //Play gameplay audio
        document.getElementById('game-music').play();

        // TODO: actually remove
        //newspanel area
        this.newspanel = this.add.sprite(640, 0, 'newspanel');
        this.newspanelLabel = this.add.text(644, 15, '', style);
        //this.securedpanelLabel = this.add.text(644, 100, '', secmstyle);
        this.vulnerablepanelLabel = this.add.text(644, 90, '', secmstyle);
        this.newspanel.visible = false;
        this.newspanelLabel.visible = false
        this.vulnerablepanelLabel.visible = false;

        //loading the map with targets and attacks
        this.createMap();
        this.createUI();
        this.refreshStats();
        
        //button to switch audio on/off
        this.audiobtn = this.add.button(10, 10, 'sound', this.musicSwitch, this);

        //start turn:
        this.startTurn();

        //modal setup:
        reg.modal = new gameModal(this.game);
        this.createModals();

        //tutorial things:
        //tutgroup.destroy();
    
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
 * Function to close current popup and start a turn to give news
 */
InsurancePlz.GameState.closePopupAndShowInstructions = function () {
    this.popup.destroy();
    this.showTutorialInstructions();
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
        this.tutgroup_r1.destroy();
        // show info round 2
        this.tutgroup_r2.visible = true;
        this.popup = new Popup("Go big or go home!", "Show your skills and execute multiple attacks at once!\n. Go ahead!", 'popuppanel');
        this.popup.addButton("Continue", this.closePopup, this);
    }
    if (this.gameProgress.turn == 3) { //end of the tutorial is reached
        this.endTutorial();
    }
};

/**
 * Function to display tutorial instrutions
 */
InsurancePlz.GameState.showTutorialInstructions = function () {
    var tutstyle = {
        color: 'white',
        // temp font, need to find font for commercial use
        font: '60px ZrNic',
        fill: '#fff',
        align: 'left',
        wordWrap: true,
        wordWrapWidth: 1300
    };
    this.tutgroup_r1 = this.game.add.group(); // group with tutorial labels etc.
    var tuthelparrow = this.game.add.sprite(100, 630, 'arrowleft');
    this.tutgroup_r1.add(tuthelparrow);
    tuthelparrow.scale.setTo(0.3);
    var tuttargetinspect1 = this.game.add.sprite(350, 230, 'arrowright');
    this.tutgroup_r1.add(tuttargetinspect1);
    var tuttargetinspect2 = this.game.add.sprite(150, 120, 'arrowright');
    this.tutgroup_r1.add(tuttargetinspect2);
    tuttargetinspect1.scale.setTo(0.3);
    tuttargetinspect2.scale.setTo(0.3);
    var tutattackhelpLabel1 = this.add.text(70, 30, '1. Inspect targets by clicking on them', tutstyle);
    this.tutgroup_r1.add(tutattackhelpLabel1);
    var tutattackhelpLabel2 = this.add.text(70, 410, '2. Click on an icon below to select attack', tutstyle);
    this.tutgroup_r1.add(tutattackhelpLabel2);
    var tutattackhelpLabel3 = this.add.text(70, 470, '3. Click on a target to align attack', tutstyle);
    this.tutgroup_r1.add(tutattackhelpLabel3);
    var tutattackhelpLabel4 = this.add.text(70, 530, '4. Execute attack(s)', tutstyle);
    this.tutgroup_r1.add(tutattackhelpLabel4);

    this.tutgroup_r2 = this.game.add.group(); // group with tutorial labels etc.
    var tuthelparrow1 = this.game.add.sprite(280, 630, 'arrowleft');
    this.tutgroup_r2.add(tuthelparrow1);
    var tuthelparrow2 = this.game.add.sprite(100, 630, 'arrowleft');
    this.tutgroup_r2.add(tuthelparrow2);
    tuthelparrow1.scale.setTo(0.3);
    tuthelparrow2.scale.setTo(0.3);
    var tuttargetinspect1 = this.game.add.sprite(350, 230, 'arrowright');
    this.tutgroup_r2.add(tuttargetinspect1);
    var tuttargetinspect2 = this.game.add.sprite(150, 120, 'arrowright');
    this.tutgroup_r2.add(tuttargetinspect2);
    tuttargetinspect1.scale.setTo(0.3);
    tuttargetinspect2.scale.setTo(0.3);
    var tutattackhelpLabel1 = this.add.text(70, 30, '1. Inspect targets by clicking on them', tutstyle);
    this.tutgroup_r2.add(tutattackhelpLabel1);
    var tutattackhelpLabel2 = this.add.text(70, 350, '2. Click the most left icon below to select attack', tutstyle);
    this.tutgroup_r2.add(tutattackhelpLabel2);
    var tutattackhelpLabel3 = this.add.text(70, 410, '3. Click on a target to align attack', tutstyle);
    this.tutgroup_r2.add(tutattackhelpLabel3);
    var tutattackhelpLabel4 = this.add.text(70, 470, '4. Click on the other icon to select another attack', tutstyle);
    this.tutgroup_r2.add(tutattackhelpLabel4);
    var tutattackhelpLabel5 = this.add.text(70, 530, '5. Execute attacks', tutstyle);
    this.tutgroup_r2.add(tutattackhelpLabel5);
    this.tutgroup_r2.visible = false;
}

/**
 * Grants the given amount of action points and refreshes the UI.
 * Does not allow more than the maximum amount of action points to be gained.
 */
InsurancePlz.GameState.updateActionPoints = function (amount) {
    if (InsurancePlz.isTutorial == false) {
        this.gameProgress.actionPoints = Math.max(Math.min(this.gameProgress.actionPoints + amount, this.gameProgress.actionPointsMax), 0);
    } else {
        this.gameProgress.actionPoints = Math.max(Math.min(this.gameProgress.actionPoints + amount, this.givePoints()), 0);
    }
    this.refreshStats();
};

InsurancePlz.GameState.musicSwitch = function(){
    if (document.getElementById('game-music').volume > 0) {
        document.getElementById('game-music').volume = 0;
        document.getElementById('menu-music').volume = 0;
    }
    else {
        document.getElementById('game-music').volume = 1;
        document.getElementById('menu-music').volume = 1;
    }
};

/**
 * Global utility function for formatting cash.
 * @params {Number} c - A number to format in typical cash format.
 * @returns {String} - A string representation of the number with $ and comma's added appropriately.
 */
function formatCash(c) {
    return '$' + c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
