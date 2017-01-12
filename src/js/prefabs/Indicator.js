/**
 * Creates a stacked attack. Automatically creates and positions the button and text.
 * @constructor
 * @param {Object} attack - The attack to stack.
 * @param {Object} target - The target for the attack.
 * @param {Number} position - The position index for this stacked attack.
 */
function Indicator(data, game) {
    //Taking over all variables supplied
    for (var key in data) {
        this[key] = data[key];
    }

    //Setting unset arguments
    if (this.sourceOffsetX  === undefined)  this.sourceOffsetX  = 0;
    if (this.sourceOffsetY  === undefined)  this.sourceOffsetY  = 0;
    if (this.targetOffsetX  === undefined)  this.targetOffsetX  = 0;
    if (this.targetOffsetY  === undefined)  this.targetOffsetY  = 0;
    if (this.lineWidth      === undefined)  this.lineWidth      = 5;
    if (this.color          === undefined)  this.color          = 0xFF0000;
    if (this.alpha          === undefined)  this.alpha          = 1;
    if (this.lineShape      === undefined)  this.lineShape      = "15 5";
    if (this.lineSpeed      === undefined)  this.lineSpeed      = 0.2;

    //Initializing remaining variables
    if (!Array.isArray(this.lineShape)) this.lineShape = this.processLineShape(this.lineShape);
    this.linePosition = 0;
    this.lineLength = this.getShapeLength();
    this.graphics = game.add.graphics(0, 0);
    this.ending = false;

    //Draw the line
    this.update();
}

/**
 * Updates the position of the indicator as necessary.
 */
Indicator.prototype.update = function() {
    //If graphics is ending, move the source
    if (this.ending) this.moveToTarget();

    //If graphics has been destroyed, stop
    if (this.graphics === undefined) return;

    //Clearing existing shape
    this.graphics.clear();

    //Updating position
    this.linePosition -= this.lineSpeed;
    if (Math.abs(this.linePosition) >= this.lineLength) {
        this.linePosition %= this.lineLength;
    }

    //Setting up a few variables
    var x = this.getSourceX();
    var y = this.getSourceY();
    this.graphics.moveTo(x, y);
    var angle = this.getAngle();
    var totalDist = this.getDistance();
    var dist = this.getStartingOffset();
    var i = this.getStartingShape();

    //Drawing the line
    while (dist < totalDist) {
        dist = Math.min(dist + this.lineShape[i], totalDist);
        if (i++ % 2 === 1) {
            this.graphics.lineStyle(0, 0, 0);
        } else {
            this.graphics.lineStyle(this.lineWidth, this.color, this.alpha);
        }
        var xv = dist * Math.cos(angle);
        var yv = dist * Math.sin(angle);
        this.graphics.lineTo(x - xv, y - yv);
        if (i >= this.lineShape.length) i %= this.lineShape.length;
    }
    this.graphics.endFill();
};

Indicator.prototype.execute = function() {
    this.ending = true;
    this.endSpeed = this.getDistance() / 35;
    this.source = {
        "x": this.source.x + this.sourceOffsetX,
        "y": this.source.y + this.sourceOffsetY
    }
    this.sourceOffsetX = 0;
    this.sourceOffsetY = 0;
}

Indicator.prototype.moveToTarget = function() {
    if (this.getDistance() < this.endSpeed) {
        this.destroy();
    } else {
        var angle = this.getAngle();
        this.source.x -= this.endSpeed * Math.cos(angle);
        this.source.y -= this.endSpeed * Math.sin(angle);
    }
}

Indicator.prototype.setLineShape = function(shape) {
    if (!Array.isArray(this.lineShape)) {
        this.lineShape = this.processLineShape(shape);
    } else {
        this.lineLength = this.getShapeLength();
    }
};

Indicator.prototype.getShapeLength = function() {
    var length = 0;
    for (var i = 0; i < this.lineShape.length; i++) {
        length += this.lineShape[i];
    }
    return length;
};

Indicator.prototype.processLineShape = function(shape) {
    var spl = shape.split(" ");
    var shape = [];
    for (var i = 0; i < spl.length; i++) {
        shape.push(parseInt(spl[i]));
    }
    return shape;
};

Indicator.prototype.getSourceX = function() {
    return this.source.x + this.sourceOffsetX;
};

Indicator.prototype.getSourceY = function() {
    return this.source.y + this.sourceOffsetY;
};

Indicator.prototype.getTargetX = function() {
    return this.target.x + this.targetOffsetX;
};

Indicator.prototype.getTargetY = function() {
    return this.target.y + this.targetOffsetY;
};

Indicator.prototype.getStartingShape = function() {
    var dist = 0;
    var pos = Math.abs(this.linePosition);
    for (var i = 0; i < this.lineShape.length; i++) {
        dist += this.lineShape[i];
        if (pos < dist) {
            return i;
        }
    }
    return 0;
};

Indicator.prototype.getStartingOffset = function() {
    var dist = 0;
    var pos = Math.abs(this.linePosition);
    for (var i = 0; i < this.lineShape.length; i++) {
        dist += this.lineShape[i];
        if (pos < dist) {
            return pos - dist;
        }
    }
    return 0;
};

Indicator.prototype.getAngle = function() {
    return Math.atan2(this.getSourceY() - this.getTargetY(), this.getSourceX() - this.getTargetX());
};

Indicator.prototype.getDistance = function() {
    return Math.sqrt(Math.pow(this.getSourceX() - this.getTargetX(), 2) + Math.pow(this.getSourceY() - this.getTargetY(), 2));
};

Indicator.prototype.hasEnded = function() {
    return this.graphics === undefined;
};

Indicator.prototype.destroy = function() {
    this.graphics.destroy();
    this.graphics = undefined;
};