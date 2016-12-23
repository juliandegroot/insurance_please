var InsurancePlz = InsurancePlz || {};
var reg = {};

/**
 * The base GameState object contains only the base Phaser functions.
 */
InsurancePlz.GameState = {
    init: function(playerData) {
        this.playerData = playerData ? playerData : {};
        // player starts out with attackmap europe:
        this.playerData.attackmap = this.playerData.attackmap ? this.playerData.attackmap : 'europe';

        this.gameProgress = {
            "turn": 1,
            "actionPoints": 10,
            "actionPointsMax": 10,
            "score": 0,
            "attackstack": [],
            "index": 0,
            "buttonstack": [
                [650, false],
                [700, false],
                [750, false],
                [800, false],
                [850, false]
            ],
            "textstack": [
                [650, ''],
                [700, ''],
                [750, ''],
                [800, ''],
                [850, '']
            ],
            "newsarray": []
        };

        //TODO: These JSON's should be removed from the cache afterwards.
        this.attackDataList = createAttacksFromJSON(this.game.cache.getText('attacks'));
        this.majorEventList = createMajorEventsFromJSON(this.game.cache.getText('major_events'));
        this.minorEventList = createMinorEventsFromJSON(this.game.cache.getText('minor_events'));
        //console.log(this.attackDataList);
    },
    create: function() {
        //attackpanel area
        this.attackpanel = this.add.sprite(0, 405, 'attackpanel');
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

        this.attackpanelLabel = this.add.text(10, 400, '', style);

        //newspanel area
        this.newspanel = this.add.sprite(640, 0, 'newspanel');
        this.newspanelLabel = this.add.text(644, 15, '', style);
        //this.securedpanelLabel = this.add.text(644, 100, '', secmstyle);
        this.vulnerablepanelLabel = this.add.text(644, 90, '', secmstyle);

        //scoreboard logo

        //loading the map with targets and attacks
        this.createMap();

        //overlay scoreboard text
        hackingdamageText = this.game.add.text(250, 10, '', scorestyle);
        //actionpoints text
        actionpointsText = this.game.add.text(10, 10, '', acpointsstyle);
        stackText1 = this.game.add.text(650, 350, '', stackstyle);
        stackText2 = this.game.add.text(700, 350, '', stackstyle);
        stackText3 = this.game.add.text(750, 350, '', stackstyle);
        stackText4 = this.game.add.text(800, 350, '', stackstyle);
        stackText5 = this.game.add.text(850, 350, '', stackstyle);
        this.refreshStats();

        //end turn button and start of game
        this.endturnbtn = this.add.button(700, 450, 'button-circle', this.endTurn, this);
        this.endturntext = this.add.text(715, 470, 'Execute Attacks', style);
        this.stackboxtext = this.add.text(650, 330, '', style);
        
        //how-to-play, information button
        this.howtoplaybtn = this.add.button(800, 400, 'howtoplay', this.showHowToPlay, this);

        //group of stacked attack buttons:
        this.stackedattacks = this.add.group();

        //start turn:
        this.startTurn();
        
        //modal setup:
        reg.modal = new gameModal(this.game);
        this.createModals();
    }
};

/**
 * Below are a number of cuntions with no clear category.
 */
InsurancePlz.GameState.updateNews = function(news) {
    this.newspanelLabel.text = news;
};

InsurancePlz.GameState.refreshStats = function() {
    var total = 0
    for (var k in this.attackMapData.targets) { // getting the actual array
        for (var l in this.attackMapData.targets[k]) {
            if (l == "damage") {
                //console.log("l: " +this.attackMapData.targets[k][l]);
                total = total + this.attackMapData.targets[k][l];
            }
            //total = total + k
        }
    }
    this.gameProgress.score = total;
    hackingdamageText.text = "$ " + this.gameProgress.score + " Damage";
    actionpointsText.text = "Attackpoints: " + this.gameProgress.actionPoints;
};

InsurancePlz.GameState.closePopup = function() {
    this.popup.destroy();
};