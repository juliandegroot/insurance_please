var InsurancePlz = InsurancePlz || {};

InsurancePlz.Attack = function(state, data) {
    Phaser.Sprite.call(this, state.game, data.x, data.y, data.asset);

    this.game = state.game;
    this.state = state;
    //this.anchor.setTo(0.5);
    this.scale.setTo(0.5);
    this.data = data;
    this.secvector = this.data.securityVector;
    this.points = this.data.points;
    this.impact = this.data.impact;
    this.id = data.id;

    //listen for input
    this.inputEnabled = true;
    this.input.pixelPerfectClick = true;
    this.events.onInputDown.add(this.state.selectAttack, this.state);
};

InsurancePlz.Attack.prototype = Object.create(Phaser.Sprite.prototype);
InsurancePlz.Attack.prototype.constructor = InsurancePlz.Attack;

InsurancePlz.Attack.prototype.getSecmeasure = function() {
    //console.log(this.data);
    //console.log(this.secvector);
    return this.secvector;
};

InsurancePlz.Attack.prototype.getEffect = function() {
    return this.impact;
};

InsurancePlz.Attack.prototype.getName = function() {
    return this.data.text;
};


InsurancePlz.Attack.prototype.getPoints = function() {
    return this.data.points;
};

InsurancePlz.Attack.prototype.getID = function() {
    return this.data.id;
};
