var InsurancePlz = InsurancePlz || {};

InsurancePlz.AttackData = function(name, securityVector, spriteTag) {
    this.name = name;
    this.securityVector = securityVector;
    this.sprite = spriteTag;

    //console.log('AttackData created: {' + this.name + ',' + this.securityVector + ',' + this.sprite + '}');
}

InsurancePlz.AttackData.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.AttackData.prototype.constructor = InsurancePlz.AttackData;

InsurancePlz.AttackData.prototype.updateSecurityVector = function(securityVector) {
    this.securityVector = securityVector;
};

/**
 * Creates an array of attack objects which it parses from the provided JSON
 * String.
 * @param {String} attacksJSON A string in JSON format containing all attacks.
 * @return {Array} attacks An array containing all the attacks in the JSON string.
 */
function createAttacksFromJSON(attacksJSON) {
    var list = JSON.parse(attacksJSON).attacks;
    var attacks = [];
    for (i = 0; i < list.length; i++) {
        attacks.push(new InsurancePlz.AttackData(list[i].attackName, list[i].securityVector, list[i].attackImage));
    }
    return attacks;
}