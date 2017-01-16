var InsurancePlz = InsurancePlz || {};

/**
 * Creates an array of target data. To each location in the AttackMapData a
 * random target is assigned. The target data array contains the original
 * target data with the additional location coordinates.
 * @param {Object[]} attackMapData - The structure holding all data for the attack map.
 * @param {Number} attackMapData.targetNumber - The number of targets for the map.
 * @param {Object[]} attackMapData.locations - Array of arrays of locations. Each location array in the array consists of x and y coordinates at index 0 and 1 respectively.
 * @param {Object[]} targetData - The structure holding all the data of the targets.
 * @returns {Array} finalTargets - The array containing the target with their locations.
 */
InsurancePlz.GameState.createTargetData = function(attackMapData, targetData) {
    var targetNumber = attackMapData.numberOfTargets;
    if (InsurancePlz.isTutorial) { targetNumber = 2; } // limit targets to practice on for tutorial
    var targetLocations = attackMapData.locations;
    var targets = targetData;
    var finalTargets = [];

    for (var i = 0; i < targetNumber; i++) {
        // Choose a random target from the remaining targets.
        var j = Math.floor(Math.random() * targets.length);
        var target = targets[j];
        // Assign the location coordinates
        target.x = targetLocations[i][0];
        target.y = targetLocations[i][1];
        // Add the target to the final target list
        finalTargets.push(target);
        // Remove the assigned target from the unassigned list
        targets.splice(j, 1);
    }
    return finalTargets;
};


/**
 * createMap creates the map part of the game: it reads in the targets, attacks
 * and assigns them to a possition in the UI.
 */
InsurancePlz.GameState.createMap = function () {
    //TODO: This function uses both a this.targets and a var targets? Rather confusing.
    this.attackMapData = JSON.parse(this.game.cache.getText('europe'));
    if (InsurancePlz.isTutorial == false) {
        var targets = this.createTargetData(this.attackMapData, JSON.parse(this.game.cache.getText('targets')).targets);
    }
    if (InsurancePlz.isTutorial) {
        console.log("bla1")
        var targets = this.createTargetData(this.attackMapData, JSON.parse(this.game.cache.getText('tutorialtargets')).targets);
    }
    this.attackMapData.targets = targets;

    this.background = this.add.sprite(0, 0, this.attackMapData.background);
    //create target instances
    this.targets = this.add.group();
    var target;
    targets.forEach(function (targetData) {
        target = new InsurancePlz.Target(this, targetData);

        var stylif = {
            font: "350px Arial",
            fill: "#ffff00",
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 50
        };
        var label_score = this.game.add.text(-50, 0, targetData.name, stylif); // adding attackweights/points as labels above the sprite
        label_score.stroke = '#000000'; // give it a black outline (stroke)
        label_score.fontSize = 350;
        label_score.strokeThickness = 3;
        target.addChild(label_score); // add it as child to the original instance
        this.game.world.bringToTop(label_score); // put it on top of the actual sprite

        this.targets.add(target);
    }, this);

    //create attack instances
    this.attacks = this.add.group();
    var attack;
    var attackData = JSON.parse(this.game.cache.getText('attacks'));
    var tutamountattacks = 1;
    attackData.attacks.forEach(function (attackData) {

        //if (tutamountattacks < 2) { // no more than 1 attack available in tutorial mode round 1
        attack = new InsurancePlz.Attack(this, attackData);

        var stylie = {
            font: "35px Arial",
            fill: "#ff0000"
        };
        var label_score = this.game.add.text(10, -30, attackData.points + " points", stylie); // adding attackweights/points as labels above the sprite
        label_score.stroke = '#000000'; // give it a black outline (stroke)
        label_score.strokeThickness = 6;
        attack.addChild(label_score); // add it as child to the original instance
        this.game.world.bringToTop(label_score); // put it on top of the actual sprite
        this.attacks.add(attack);
        //}
        if (InsurancePlz.isTutorial) { // were in tutorial mode now
            for (var i = 0, len = this.attacks.children.length; i < len; i++) {
                if (i > 0) { // all attacks except the first one are made invisible
                    this.attacks.children[i].inputEnabled = false;
                    this.attacks.children[i].visible = false;
                }
            }
        }
    }, this);
};


/**
 * showHowToPlay creates an information button and fills it with tips and general
 * information regarding security measures to the player gets an idea what attacks to
 * align for maximum effect.
 */
InsurancePlz.GameState.showHowToPlay = function() {
    this.popup = new Popup("Hackers Manual", "Companies are able to secure themselves in various ways by taking security measures:\n1. IoT protected devices: provides strong protection against all except password stealing and social engineering.\n2. No BYOD-policy: provides strong protection against all except password stealing and social engineering.\n3. Password management: provides strong protection against password stealing and social engineering.\n4. Email or web security devices: provides strong protection against all except usb-leaks, password stealing and social engineering..\n5. Auto-software-update on all devices: provides strong protection against almost every attack except password stealing and social engineering.\n6. Firewall updating: provides strong protection against almost every attack except password stealing and social engineering.\n7. Staff training (cyberaware): protects mildly against all attacks.\n8. Risk assessment & audit: protects mildly against all attacks.\n9. Technical advice on hard- and software risks: protects mildly against all attacks.\n10. Service contract (SLA) with IT-specialists: protects mildly against all attacks. ", 'howtoplaypanel');
    this.popup.addButton("Let's hack", this.closePopup, this);
};

/**
 * askBackToMenu creates a popup with the question if the player wants to return to the main menu
 */
InsurancePlz.GameState.askBackToMenu = function() {
    this.popup = new Popup("Return to the main menu?", "Pay attention, if you click yes all progress will be lost. If you click no you return to the game", 'howtoplaypanel');
    this.popup.addButton("No", this.closePopup, this);
    this.popup.addButton("Yes", this.loadMenu, this);
};

InsurancePlz.GameState.createUI = function() {
  new InsurancePlz.AttackBox(this.game, 0, 610);
  new InsurancePlz.ButtonBox(this.game, 960, 610);
  new InsurancePlz.InformationBox(this.game, 640, 610);
};

InsurancePlz.GameState.createModals = function() {
    //////// modal 1 ////////////
    reg.modal.createModal({
        type: "not-enough-action-points",
        includeBackground: true,
        modalCloseOnInput: true,
        itemsArr: [{
            type: "graphics",
            graphicColor: "0xffffff",
            graphicWidth: 300,
            graphicHeight: 300,
            graphicRadius: 40
        }, {
            type: "text",
            content: "Not enough attack points",
            fontFamily: "Luckiest Guy",
            fontSize: 22,
            color: "0x1e1e1e",
            offsetY: -50
        }, ]
    });
    //////// modal 2 ////////////
    reg.modal.createModal({
        type: "already-stacked-for-target",
        includeBackground: true,
        modalCloseOnInput: true,
        itemsArr: [{
            type: "graphics",
            graphicColor: "0xffffff",
            graphicWidth: 300,
            graphicHeight: 300,
            graphicRadius: 40
        }, {
            type: "text",
            content: "Already stacked for target",
            fontFamily: "Luckiest Guy",
            fontSize: 22,
            color: "0x1e1e1e",
            offsetY: -50
        }, ]
    });
    //////// modal 3 ////////////
    reg.modal.createModal({
        type: "stack-full",
        includeBackground: true,
        modalCloseOnInput: true,
        itemsArr: [{
            type: "graphics",
            graphicColor: "0xffffff",
            graphicWidth: 300,
            graphicHeight: 300,
            graphicRadius: 40
        }, {
            type: "text",
            content: "Attack stack is full",
            fontFamily: "Luckiest Guy",
            fontSize: 22,
            color: "0x1e1e1e",
            offsetY: -50
        }, ]
    });
};
