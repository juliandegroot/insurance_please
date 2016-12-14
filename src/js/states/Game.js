var InsurancePlz = InsurancePlz || {};

InsurancePlz.GameState = {

    init: function (playerData) {
        this.playerData = playerData ? playerData : {};
        // player starts out with attackmap europe:
        this.playerData.attackmap = this.playerData.attackmap ? this.playerData.attackmap : 'europe';

    this.gameProgress = {
      "turn":1,
      "actionPoints":100,
      "actionPointsMax":100,
      "score":0,
      "attackstack": [],
      "index": 0,
      "buttonstack": [[650,false],[700,false],[750,false],[800,false],[850,false]],
      "textstack": [[650,''],[700,''],[750,''],[800,''],[850,'']],
      "newsarray": []
    };

    this.attackDataList = createAttacksFromJSON(this.game.cache.getText('attacks'));
    //console.log(this.attackDataList);

    },
    create: function () {
        //attackpanel area
        this.attackpanel = this.add.sprite(0, 405, 'attackpanel');
        var style = {
            color: 'white',
            // temp font, need to find font for commercial use
            font: '15px HackerFont',
            fill: '#fff',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256
        };
        var scorestyle = {
            color: 'red',
            // temp font, need to find font for commercial use
            font: '15px HackerFont',
            fill: '#f00',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256
        };
        var acpointsstyle = {
            color: 'yellow',
            // temp font, need to find font for commercial use
            font: '15px HackerFont',
            fill: '#f0f',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256
        };
        var stackstyle = {
            color: 'yellow',
            // temp font, need to find font for commercial use
            font: '15px HackerFont',
            fill: '#ffff00',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256
        };
        this.attackpanelLabel = this.add.text(10, 400, '', style);

    //newspanel area
    this.newspanel = this.add.sprite(640, 0, 'newspanel');
    this.newspanelLabel = this.add.text(644, 15, '', style);

    //scoreboard logo

    //loading the map with targets and attacks
    this.createMap();

    this.damagelogo = this.add.sprite(0, 0, 'hackdamage');
    this.damagelogo.scale.setTo(0.1);
    //overlay scoreboard text
    hackingdamageText = this.game.add.text(480, 30, '', scorestyle);
    //actionpoints text
    actionpointsText = this.game.add.text(480, 10, '', acpointsstyle);
    stackText1 = this.game.add.text(650, 350, '', stackstyle);
      stackText2 = this.game.add.text(700, 350, '', stackstyle);
      stackText3 = this.game.add.text(750, 350, '', stackstyle);
      stackText4 = this.game.add.text(800, 350, '', stackstyle);
      stackText5 = this.game.add.text(850, 350, '', stackstyle);
    this.refreshStats();

    //end turn button and start of game
    this.endturnbtn = this.add.button(700, 450, 'button-circle', this.endTurn, this);
    this.endturntext = this.add.text(715, 470, 'End turn', style);
    this.stackboxtext = this.add.text(650, 330, '', style);

    //group of stacked attack buttons:
    this.stackedattacks = this.add.group();

    //start turn:
    this.startTurn();
  },

    /**
     * createMap creates the map part of the game: it reads in the targets, attacks
     * and assigns them to a possition in the UI.
     */
    createMap: function() {
        this.attackMapData = JSON.parse(this.game.cache.getText(this.playerData.attackmap));
        let targets = this.createTargetData(this.attackMapData, JSON.parse(this.game.cache.getText('targets')).targets);

    this.attackMapData.targets = targets;

        this.background = this.add.sprite(0, 0, this.attackMapData.background);
        //create target instances
        this.targets = this.add.group();
        var target;
        targets.forEach(function(targetData) {
            target = new InsurancePlz.Target(this, targetData);
            this.targets.add(target);
        }, this);

        //create attack instances
        this.attacks = this.add.group();
        var attack;
        this.attackMapData.attacks.forEach(function(attackData) {
            attack = new InsurancePlz.Attack(this, attackData);
            this.attacks.add(attack);
        }, this);
    },

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
    createTargetData: function(attackMapData, targetData) {
        let targetNumber = attackMapData.numberOfTargets;
        let targetLocations = attackMapData.locations;
        let targets = targetData;
        let finalTargets = [];

    for (i = 0; i < targetNumber; i++) {
      // Choose a random target from the remaining targets.
      let j = Math.floor(Math.random() * targets.length);
      let target = targets[j];
      // Assign the location coordinates
      target.x = targetLocations[i][0];
      target.y = targetLocations[i][1];
      // Add the target to the final target list
      finalTargets.push(target);
      // Remove the assigned target from the unassigned list
      targets.splice(j,1);
    }
    return finalTargets;
  },


    /**
     * Makes current selected attack (sprite) transparant and deselects previously selected attacks
     * @param {object} attack The attack we select
     */
    selectAttack: function (attack) {
        if (this.selectedAttack != attack) {
            this.clearAttackSelection();
            this.selectedAttack = attack;
            this.selectedAttack.alpha = 0.5;
        } else {
            this.clearAttackSelection();
        }
    },
    clearAttackSelection: function () {
        this.selectedAttack = null;
        this.attacks.setAll('alpha', 1);
    },
    updateNews: function (news) {
        this.newspanelLabel.text = news;
    },
    refreshStats: function () {
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
      hackingdamageText.text = "$ " +this.gameProgress.score +"\nDamage total";
      actionpointsText.text = "A.points: " +this.gameProgress.actionPoints;
  },


    closeNews: function() {
        console.log('Closing news');
        this.popup.group.destroy();
    },
    //Could be extended with an additional argument for a callback function
    createPopup: function(text, btntext) {
        //Create objects to hold the data
        this.popup = {};
        this.popup.group = this.add.group();

    //Create background
    this.popup.background = this.add.graphics(0, 0);
    this.popup.background.inputEnabled = true;
    this.popup.background.beginFill(0x000000, 0.5);
    this.popup.background.drawRect(0, 0, 1000, 1000);
    this.popup.background.endFill();

    //Create popup panel
    this.popup.panel = this.add.sprite(this.game.world.centerX,
      this.game.world.centerY,'popuppanel');
    this.popup.panel.anchor.setTo(0.5);

    //Text style
    var style = {
      color: 'white',
      font: '15px HackerFont',
      fill: '#fff',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 440
    };

    //Message text. Can be changed to also use anchor(0.5) to center vertically
    this.popup.message = this.add.text(this.game.world.centerX-220,
      this.game.world.centerY-160, text, style);

    this.popup.group.add(this.popup.background);
    this.popup.group.add(this.popup.panel);
    this.popup.group.add(this.popup.message);

    if (btntext!=null){
      //Close button
      this.popup.button = this.add.button(this.game.world.centerX,
      this.game.world.centerY+140, 'button', this.closeNews, this);
      this.popup.button.anchor.setTo(0.5);
      //Close button text
      this.popup.buttontext = this.add.text(this.game.world.centerX,
        this.game.world.centerY+145, btntext, style);
      this.popup.buttontext.anchor.setTo(0.5);
      this.popup.group.add(this.popup.button);
      this.popup.group.add(this.popup.buttontext);
    }

    },
    /**
     * Returns available an available x coordinate from the buttonstack
     * where we are dealing with a 2dimensional array : [[650, false],..]
     * so the next stacked attack can be placed on that position
     * @returns {number} - available x coordinate
     */
    giveAvailableButtonx: function () {
        console.log(this.gameProgress.buttonstack);
        for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
            if (this.gameProgress.buttonstack[i][1] == false) { // if the 2nd element is false we can place
                return this.gameProgress.buttonstack[i][0]; // return first available x
            }
        }
    },
    /**
     * Checks if all positions for stacked attack buttons in UI are available
     * If not we can update UI to show no more text in stackboxtext.text
     * @returns {boolean} - true
     */
    checkAllButtonsAvailable: function () {
        for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
            if (this.gameProgress.buttonstack[i][1] != false) {
                return true; // 1 or more attacks are stacked
            }
        }
        return false; // no attacks are currently stacked
    },
    setButtonxTaken: function (coordx) {
        for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
            if (this.gameProgress.buttonstack[i][0] == coordx) {
                this.gameProgress.buttonstack[i][1] = true; // taken

            }
        }
    },
    setButtonxAvailable: function (coordx) {
        for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
            if (this.gameProgress.buttonstack[i][0] == coordx) {
                this.gameProgress.buttonstack[i][1] = false; // taken

            }
        }
    },
    setAllButtonxAvailable: function () { // at round end
        for (var i = 0; i < this.gameProgress.buttonstack.length; i++) {
            this.gameProgress.buttonstack[i][1] = false; // taken
        }
    },
    stackAttack: function (target, attack, sprite) {
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
        this.stackbutton.attackpoints = attack.getPoints();
        this.stackbutton.attackid = attack.getID();
        this.stackbutton.xcoord = newx;
        var scorestyle = {
            color: 'red',
            // temp font, need to find font for commercial use
            font: '15px HackerFont',
            fill: '#f00',
            align: 'left',
            wordWrap: true,
            wordWrapWidth: 256

    };


      this.gameProgress.index += 50;
      this.stackedattacks.add(this.stackbutton);
      this.stackboxtext.text = 'Stacked Attacks:';

      if (newx == 650) { stackText1.text = this.stackbutton.targetid; }
      if (newx == 700) { stackText2.text = this.stackbutton.targetid;}
      if (newx == 750) { stackText3.text = this.stackbutton.targetid;}
      if (newx == 800) { stackText4.text = this.stackbutton.targetid;}
      if (newx == 850) { stackText5.text = this.stackbutton.targetid;}
      this.game.world.bringToTop(stackText1);this.game.world.bringToTop(stackText2);this.game.world.bringToTop(stackText3);this.game.world.bringToTop(stackText4);this.game.world.bringToTop(stackText5);

    },
    removeFromStack: function (button) {
        console.log("button tid: " + button.targetid);
        console.log(button.attackid);
        var i = this.gameProgress.attackstack.length;
        while (i--) {
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
                //console.log("bli");console.log(this.gameProgress.attackstack);
                button.destroy();
                this.gameProgress.actionPoints += button.attackpoints;
                this.refreshStats();
            }
        }
        if (this.checkAllButtonsAvailable() == false) { // no attacks are currently stacked
            this.stackboxtext.text = '';
        }
    },
    flushAttackStack: function () {
        var i = this.gameProgress.attackstack.length;
        while (i--) {
            console.log("destroying " + i);
            this.stackedattacks.children[i].destroy();
        }
        this.stackboxtext.text = '';
        stackText1.text = '';
        stackText2.text = '';
        stackText3.text = '';
        stackText4.text = '';
        stackText5.text = ''
    },
    /**
     * Makes the gameProgress attackstack empty.
     */
    clearAttackStack: function () {
        this.gameProgress.attackstack = [];
    },
    executeAttacks: function () {
        // for each target and attack combination in the attackstack array:
        //console.log("the attack stack:");console.log(this.gameProgress.attackstack);
        for (var i = 0; i < this.gameProgress.attackstack.length; i++) {
          let target = this.gameProgress.attackstack[i][0];
          let attack = this.gameProgress.attackstack[i][1];
          target.doDamage(attack.getSecmeasure(), attack.getEffect());
        }
    },

    /**
     * Function to generate news items as JSON objects to be put in newsarray
     * which is part of the game's gameProgress object
     * @param {number} damagedone     - the damage inflicted
     * @param {string} attackname     - the name of the attack
     * @param {string} targetname     - the name of the target (company)
     * @param {string} targetcategory - the type of target (i.e. bank, insurance)
     */
    generateAttackNewsItem: function (damagedone, attackname, targetname, targetcategory) {
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
    },
    /**
     * TODO: remove: only usefull for debugging.
     * Help function to show all news items from gameProgress newsarray
     */
    showNews: function () {
        console.log("All the news:")
        for (var i = 0; i < this.gameProgress.newsarray.length; i++) {
            var newsitem = this.gameProgress.newsarray[i];
            console.log(newsitem);
        }
    },
    /**
     * Function to check if given attack is already in this round stack for given target
     * @param   {number}  target_id - the target id as shown in targets.json
     * @param   {number}  attack_id - the attack id as shown in europe.json
     * @returns {boolean} showing true if its already in the stack, otherwise false
     */
    alreadyStackedForTarget: function (target_id, attack_id) {
        for (var i = 0; i < this.gameProgress.attackstack.length; i++) {
            var target = this.gameProgress.attackstack[i][0];
            var attack = this.gameProgress.attackstack[i][1];
            var tar_id = target.getID();
            var atk_id = attack.getID();
            if (tar_id == target_id && atk_id == attack_id) {
                console.log("Combination already stacked! Tar_id: " + tar_id + " Atk_id: " + atk_id);
                return true
            }
        }
        return false;
    },
    startTurn: function () {
        //Pop up news message, fade out & make uninteractable rest of game
        if (this.gameProgress.newsarray === undefined || this.gameProgress.newsarray.length == 0) {
          this.createPopup("There is no news today!\nHappy hacking!\n", 'Close');
        } else {
          let text = "THE NEWS\n";
          for (var i = 0; i < this.gameProgress.newsarray.length; i++) {
            let newsitem = this.gameProgress.newsarray[i];
            text += newsitem.headline += "\n" + newsitem.body + "\n\n";
          }
          this.createPopup(text, 'Close');
        }
    },
    endTurn: function () {
        this.flushAttackStack(); // buttons on the right in panel
        this.executeAttacks() // we are executing our attacks
        this.clearAttackStack(); // clear stacked attack array
        this.setAllButtonxAvailable(); // all button positions can be taken again
        this.gameProgress.index = 0;
        this.gameProgress.turn++;
        this.gameProgress.actionPoints = this.gameProgress.actionPointsMax;
        this.refreshStats(); // update stats
        console.log('It is now turn: ' + this.gameProgress.turn);
        if (this.gameProgress.turn > 3) {
            this.endGame();
        } else {
            this.startTurn();
        }
    },
    endGame: function () {
        this.createPopup('Congratulations. You have reached the end of the prototype game!');
    }
};
