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
        targets.splice(j, 1);
    }
    return finalTargets;
};


    /**
     * createMap creates the map part of the game: it reads in the targets, attacks
     * and assigns them to a possition in the UI.
     */
InsurancePlz.GameState.createMap = function() {
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
};