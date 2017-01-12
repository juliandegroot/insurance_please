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
    this.state.newspanelLabel.text = "Targetname: " + this.data.name + "\nDamage: $" + this.data.damage + "\nVulnerabilities: \n";
    //this.state.securedpanelLabel.text = this.getSecuredString();
    this.state.vulnerablepanelLabel.text = this.getVulnerableString();

    //If no attack is selected, stop here
    if (this.state.selectedAttack != null){
        this.state.stackAttack(this.state.selectedAttack, this);
    }
};

InsurancePlz.Target.prototype.getSecuredString = function() {
    var string = "Secured:\n";
    for (var key in this.data.securityVector) { // getting the actual array
        if (this.data.securityVector[key] === 1) {
            string = string + key + "\n";
        }
    }
    return string;
};

InsurancePlz.Target.prototype.getVulnerableString = function() {
    var string = "";
    for (var key in this.data.securityVector) { // getting the actual array
        if (this.data.securityVector[key] === 0) {
            switch (key) {
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

InsurancePlz.Target.prototype.doDamage = function(attack) {

    var aweights = { //constant attack weights
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

    var attackStrength = 0;
    var reducFactor = 0;
    var effectOn = [];
    var damageAvoidedOn = [];

    // Get the damage effects and factor.
    for (var key in aweights) {
        if (this.data.securityVector[key] === 0) {
            effectOn.push(attack.secvector[key]);
            attackStrength += aweights[key];
        }
    }

    // Get the reduction effects and factor.
    for (var key in dweights) {
        if (this.data.damagecontrol[key] === 1) {
            damageAvoidedOn.push(key);
            reducFactor += dweights[key];
        }
    }

    var hacker_damage_inflicted = Math.round(attackStrength * 100000);
    var company_damage_suffered = hacker_damage_inflicted * (1 - reducFactor) * (1 + (0.5-Math.random())/10);
    // Cleanliness rounding
    company_damage_suffered = company_damage_suffered - company_damage_suffered%100;

    // Display graphic when damage is dealt
    if (company_damage_suffered > 0) {
        var sufferedTargetTween = this.game.add.tween(this);
        sufferedTargetTween.to({
            tint: 0xFF0000 // flicker to red
        }, 500);
        sufferedTargetTween.onComplete.add(function() {
            this.tint = 0xFFFFFF; // back to normal tint
        }, this);
        sufferedTargetTween.start();
    }

    // Keeping count of total damage done
    this.data.damage = this.data.damage + company_damage_suffered;

    // Data that needs to be returned for generating the news
    return {
        "attackID": attack.id,
        "attackName": attack.data.name,
        "companyName": this.data.name,
        "damage": company_damage_suffered
    };
};

/**
 * @returns {Boolean} - Returns true if this target has any security set to 0.
 */
InsurancePlz.Target.prototype.canBeUpgraded = function() {
    for (var k in this.data.securityVector) {
        if (this.data.securityVector[k][1] === 0) {
            return true;
        }
    }
    return false;
};

/**
 * Sets a random security to 1.
 * @returns {Boolean} - True if something could be upgraded. False otherwise.
 */
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