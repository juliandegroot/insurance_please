/**
 * Executes (a number of?) minor, silent events.
 * Decides which event to trigger using a roulette system based on the weights of each event.
 */
InsurancePlz.GameState.triggerMinorEvent = function() {
    let roulette = [];
    for (var i = 0; i < this.minorEventList.length; i++) {
        console.log(this.minorEventList[i]);
        for (var j = 0; j < this.minorEventList[i].getWeight(); j++) {
            roulette.push(i);
        }
    }
    this.minorEventList[roulette[Math.floor(Math.random() * roulette.length)]].execute();
};

/**
 * Attempts to upgrade a random key in the security vector of a random target.
 * @returns {Boolean} success - True or false depending on whether an upgradable target was found.
 */
InsurancePlz.GameState.triggerMinorEvent_security_upgrade = function() {
    console.log("Security upgraded");
    let list = [];
    for (var i = 0; i < this.targets.children.length; i++) {
        if (this.targets.children[i].canBeUpgraded()) {
            list.push(i);
        }
    }
    if (list.length > 0) {
        this.targets.children[list[Math.floor(Math.random() * list.length)]].upgradeSecurity();
        return true;
    } else {
        return false;
    }
};

/**
 * Increases the impact of a random target by 1.
 */
InsurancePlz.GameState.triggerMinorEvent_impact_upgrade = function() {
    console.log("Impact upgraded");
    this.targets.children[Math.floor(Math.random() * this.targets.children.length)].data.impact++;
    return true;
};