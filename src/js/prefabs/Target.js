var InsurancePlz = InsurancePlz || {};

InsurancePlz.Target = function(state, data) {
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

InsurancePlz.Target.prototype.touch = function() {
    //shows target info in news panel:

    var news = "Targetname: " + this.data.name + "\nDamage: $" + this.data.damage + "\nVulnerabilities: \n";
    var secured = this.getSecuredString();
    var vulnerabilities = this.getVulnerableString();

    this.state.newspanelLabel.text = news;
    //this.state.securedpanelLabel.text = secured;
    this.state.vulnerablepanelLabel.text = vulnerabilities;

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
        if ((this.state.enoughPoints(attackweightpoints) == true) && (this.state.alreadyStackedForTarget(targetid, attackid) == false) && this.state.gameProgress.attackstack.length <= 4) {
            //while attack points last and selected attack does not let us drop below 0:
            //throw combination of target & attack object into array while points last to execute these combinations when user clicks button "attack" at which a round ends.
            // and cannot stack same tar/attack combination more than once
            this.state.stackAttack(this, this.state.selectedAttack, this.state.selectedAttack.data.asset);
            this.state.gameProgress.actionPoints = this.state.gameProgress.actionPoints - this.state.selectedAttack.data.points;
            this.state.refreshStats();
            console.log("Stacked: Target_id: " + this.data.id + " Attack_id: " + this.state.selectedAttack.data.id);
            this.state.clearAttackSelection(); // deselect attack

        } else {
            console.log("Already stacked or attackstack is full! (max 5)");
            this.state.clearAttackSelection(); // deselect attack
        }
    }
    console.log("Current action points: " + this.state.gameProgress.actionPoints);
};

InsurancePlz.Target.prototype.getSecuredString = function() {
    var secvector = this.data.securityVector; // the target's security vector object
    var string = "Secured:\n";
    for (var key in secvector) { // getting the actual array
        if (secvector[key] == 1) {
            string = string + key + "\n";
        }
    }
    return string;
};

InsurancePlz.Target.prototype.getVulnerableString = function() {
    var secvector = this.data.securityVector; // the target's security vector object
    var string = "";
    var description = "";
    for (var key in secvector) { // getting the actual array
        if (secvector[key] == 0) {
            switch (key) {
                case "iot":
                    string = string + "- IoT devices unprotected\n";
                    break;
                case "nobyod":
                    string = string + "- Employees can bring their own device\n";
                    break;
                case "pwman":
                    string = string + "- No password management\n";
                    break;
                case "websec":
                    string = string + "- Email or web security devices missing\n";
                    break;
                case "autoup":
                    string = string + "- No automatic software updating\n";
                    break;
                case "firewall":
                    string = string + "- Firewall not up to date\n";
                    break;
                case "stafftrain":
                    string = string + "- Staff is not well-trained (cyberaware)\n";
                    break;
                case "riskaudit":
                    string = string + "- Risk assessment issues\n";
                    break;

                case "techadvice":
                    string = string + "- Tech-advice on soft- & hardware missing\n";
                    break;

                case "serviceon":
                    string = string + "- Proper service contracts missing\n";
                    break;
            }
        }
    }
    return string;
};

InsurancePlz.Target.prototype.getDamage = function() {
    return this.damage;
};

InsurancePlz.Target.prototype.getID = function() {
    return this.data.id;
};

InsurancePlz.Target.prototype.getName = function() {
    return this.data.name;
};

InsurancePlz.Target.prototype.doDamage = function(atkvec, effectiveness, attackid, attackname, targetname, targetobject) {

    var weights = { //constant attack weights
        "iot": 1,
        "nobyod": 1,
        "pwman": 1,
        "websec": 1,
        "autoup": 1,
        "firewall": 1,
        "stafftrain": 0.2,
        "riskaudit": 0.2,
        "techadvice": 0.2,
        "serviceon": 0.2
    }
    var dweights = { //constant defense weights
        "insurance": 0.25,
        "backup": 0.25,
        "offline": 0.25,
        "infra": 0.25
    }
    var attackstrength = 0;
    var reducfactor = 0;
    var effecton = [];
    var damageavoidedon = [];

    for (var key in dweights) {
        if (this.data.damagecontrol[key] === 1) {
            damageavoidedon.push(key);
            reducfactor += dweights[key];
        }
    }

    for (var i = 0; i < atkvec.length; i++) {
        if (this.data.securityVector[atkvec[i]] === 0) {
            effecton.push(atkvec[i]);
            attackstrength += weights[atkvec[i]];
        }
    }

    var hacker_damage_inflicted = Math.round(attackstrength * 100000);
    var company_damage_suffered = hacker_damage_inflicted * (1 - reducfactor);


    console.log("Attackstrength: " + attackstrength);
    console.log(effecton);
    console.log("Damage reduc factor: " + reducfactor);
    console.log(damageavoidedon);
    console.log("Hacker has done $" + Math.round(attackstrength * 100000) + " in damage")
    console.log("Company suffered $" + Math.round(((attackstrength - (reducfactor * attackstrength)) * 100000)) + " in damage")

    if (company_damage_suffered > 0) {
        var sufferedTargetTween = this.game.add.tween(targetobject);
        sufferedTargetTween.to({
            tint: 0xFF0000 // flicker to red
        }, 500);
        sufferedTargetTween.onComplete.add(function() {
            targetobject.tint = 0xFFFFFF; // back to normal tint
        }, this);
        sufferedTargetTween.start();
        // TODO: remove this?
        // this.state.generateAttackNewsItem(company_damage_suffered, attackname, targetname, this.data.category);
    }
    this.data.damage = this.data.damage + company_damage_suffered;
    //TODO pass on to news: this.state.generateAttackNewsItem(damage_inflicted, attackname, targetname, this.data.category);
    //TODO random damage range that determines what effects are chosen for the news sheet
    var res = {
        attackID: attackid,
        attackName: attackname,
        companyName: targetname,
        damage: company_damage_suffered,
        // TODO: this should be the actual thing, currently a placeholder
        reduction: "TemporaryReduction"
    }

    return res;
};

InsurancePlz.Target.prototype.canBeUpgraded = function() {
    for (var k in this.data.securityVector) {
        if (this.data.securityVector[k][1] === 0) {
            return true;
        }
    }
    return false;
};

InsurancePlz.Target.prototype.upgradeSecurity = function() {
    var keys = [];
    for (var key in this.data.securityVector) {
        if (this.data.securityVector[key] === 0) {
            keys.push(key);
        }
    }
    if (keys.length > 0) {
        var rand = keys[Math.floor(Math.random() * keys.length)];
        this.data.securityVector[rand] = 1;
        return true;
    } else {
        return false;
    }
};