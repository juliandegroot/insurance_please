var InsurancePlz = InsurancePlz || {};

InsurancePlz.Target = function (state, data) {
    Phaser.Sprite.call(this, state.game, data.x, data.y, data.asset);

    this.game = state.game;
    this.state = state;
    this.anchor.setTo(0.5);
    this.scale.setTo(0.07);
    this.data = data;
    this.damage = this.data.damage;

    //listen for input
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.touch, this);
};

InsurancePlz.Target.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.Target.prototype.constructor = InsurancePlz.Target;

InsurancePlz.Target.prototype.touch = function () {
    //shows target info in news panel:

    var news = this.data.text + "\n" + this.data.name + "\n" + this.data.category + "\nDamge: " + this.data.damage + "\nSecurity Vector: \n" + this.getVectorString();

    this.state.newspanelLabel.text = news;


    //are we selecting anything?
    var selectedAttack = this.state.selectedAttack;

    if (selectedAttack) {
        //are there interactions? are they with the selected attack?
        var seclevel = 2;
        console.log("Number security levels: " + seclevel);
        var secvector = this.state.selectedAttack.data.securityVector; // the attack's security vector object
        var attackweightpoints = this.state.selectedAttack.data.points;
        var targetid = this.data.id;
        var attackid = this.state.selectedAttack.data.id;
        for (var i in secvector) { // i.e. ["iot", 1]
            if (secvector[i][1] == 1) { // 1
                //console.log("Attack" + attackid + " will try bypass sec. measure " + secvector[i][0] + " for Tar_id: " + this.data.id + " detected");
            }
        }
        if (((this.state.gameProgress.actionPoints - attackweightpoints) >= 0) && (this.state.alreadyStackedForTarget(targetid, attackid) == false)) {
            //while attack points last and selected attack does not let us drop below 0:
            //throw combination of target & attack object into array while points last to execute these combinations when user clicks button "attack" at which a round ends.
            // and cannot stack same tar/attack combination more than once
            this.state.stackAttack(this, this.state.selectedAttack, this.state.selectedAttack.data.asset);
            this.state.gameProgress.actionPoints = this.state.gameProgress.actionPoints - this.state.selectedAttack.data.points;
            this.state.refreshStats();
            console.log("Stacked: Target_id: " + this.data.id + " Attack_id: " + this.state.selectedAttack.data.id);
            this.state.clearAttackSelection(); // deselect attack

        } else {
            console.log("Cannot stack, not enough points or already stacked");
            this.state.clearAttackSelection(); // deselect attack
        }
    }
    console.log("Current action points: " + this.state.gameProgress.actionPoints);
};

InsurancePlz.Target.prototype.getVectorString = function () {
    var secvector = this.data.securityVector; // the target's security vector object
    var string = "";
    for (var k in secvector) { // getting the actual array
        if (secvector[k][1] == 1) {
            string = string + secvector[k][0] + ": secured \n";
            //console.log(string);
        }
        if (secvector[k][1] == 0) {
            string = string + secvector[k][0] + ": vulnerable \n";
        }
    }
    return string;
};

InsurancePlz.Target.prototype.getDamage = function () {
    return this.damage;
};

InsurancePlz.Target.prototype.getID = function () {
    return this.data.id;
};

InsurancePlz.Target.prototype.getName = function () {
    return this.data.name;
};

InsurancePlz.Target.prototype.doDamage = function (atkvec, effectiveness, attackname, targetname) {
    //console.log("D.dmage: attack vector: ");
    //console.log(atkvec);
    //console.log("D.dmage: target secvector: ");
    //console.log(this.data.securityVector);
    var weights = [["iot", 1], ["nobyod", 1], ["pwman", 1], ["websec", 1], ["autoup", 1], ["firewall", 1], ["stafftrain", 0.2], ["riskaudit", 0.2], ["techadvice", 0.2], ["servicecon", 0.2]]; // these are constants
    var dweights = [["insurance", 0.25], ["backup", 0.25],["offline",0.25],["infra", 0.25]]; // these are constants
    var cell = 0;
    var cell_sum = 0;
    var hacker_damage_inflicted = 0;
    var company_damage_suffered = 0;
    var attackstrength = 0;
    var maxseclevel = 1;
    var tempnum = 0;
    var totalseclevels = 0;
    var atk_multiplied_tar = 0;
    var targetsecvector = this.data.securityVector; // the target's security vector object
    var dreduction = this.data.damagecontrol; // the target's damage control properties (array)
    var reducfactor = 0;
    var effecton = [];
    var damageavoidedon = [];
    for (var d in dweights) {
        var dcontrolmeasure = dweights[d][0];
        var dweight = dweights[d][1]; // 0.25
        for (var f in dreduction) {
            var damagecontrolmeasure = dreduction[f][0]; // we start with "insurance"
            var dnumber = dreduction[f][1]; // 1 as in json
            if (damagecontrolmeasure == dcontrolmeasure) {
                reducfactor += dnumber * dweight
                if (dnumber == 1) {  damageavoidedon.push(damagecontrolmeasure); } // throw in array to be used later in news
            }
        }
    }

    for (var k in weights) {
        var weighttocheck = weights[k][0]; // we start with "iot"
        var weighttochecklevel = weights[k][1]; // this would be 1 (upper row in matrix under sec measures)

        for (var j in atkvec) { // we iterate over the attack's secmeasures it has effect on

            if (atkvec[j] == weighttocheck) { // we check when they are the same, i.e.  iot = iot
                for (var t in targetsecvector) { // then we start iterating over the target's secmeasures
                    if (targetsecvector[t][0] == weighttocheck) { // we check for the ones they can have effect on and put them in an array
                        effecton.push(weighttocheck);
                        tempnum += weighttochecklevel;
                        cell = targetsecvector[t][1] * weighttochecklevel;

                        cell_sum += cell;


                    }
                }
                if (weighttochecklevel == 1) {
                    totalseclevels++;
                }
            }
        }

    }
    //console.log("tempnum: " + tempnum);
    //console.log("cell_sum: " + cell_sum);
    //console.log("totalseclevels: " + totalseclevels);
    attackstrength = Math.round((1 - (cell_sum / tempnum)) * 10) / 10;
    console.log("Attackstrength: " + attackstrength);
    console.log(effecton);
    console.log("Damage reduc factor: " + reducfactor);
    console.log(damageavoidedon);
    console.log("hacker has done $" + attackstrength * 100000 + " in damage")
    console.log("company suffered $" + ((attackstrength - (reducfactor * attackstrength)) * 100000) + " in damage")
    hacker_damage_inflicted = attackstrength * 100000;
    company_damage_suffered = ((attackstrength - (reducfactor * attackstrength)) * 100000);

    if (company_damage_suffered > 0) {
      this.state.generateAttackNewsItem(company_damage_suffered, attackname, targetname, this.data.category);
    }

    this.data.damage = this.data.damage + company_damage_suffered
    //TODO pass on to news: this.state.generateAttackNewsItem(damage_inflicted, attackname, targetname, this.data.category);
    //TODO random damage range that determines what effects are chosen for the news sheet

};
