/**
 * Creates an (animated) indicator arrow.
 * It is required that the data parameter has a source and target (which both must have an x and y).
 * Further variables can also be set, but are not required.
 * The shape of the line is given by a space-separated String of numbers (e.g. "15 5").
 * This will create a shape that draws a line of 15 length, then draws nothing for 5 length. 
 * @constructor
 * @param {Object} data - A JSON object. All data in this object will be copied over.
 * @param {Object} game - A reference to the Phaser game.
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
    this.lineOffset = 0;
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

    //Updating line offset (this creates the illusion of movement)
    this.lineOffset -= this.lineSpeed;
    if (Math.abs(this.lineOffset) >= this.lineLength) {
        this.lineOffset %= this.lineLength;
    }

    //Setting up a few variables
    var x = this.getSourceX();
    var y = this.getSourceY();
    this.graphics.moveTo(x, y);
    this.graphics.lineStyle(this.lineWidth, this.color, this.alpha);
    var angle = this.getAngle();
    var totalDist = this.getDistance();
    var dist = this.getStartingOffset();
    var i = this.getStartingShape();

    //Drawing the line
    while (dist < totalDist) {
        dist = Math.min(dist + this.lineShape[i], totalDist);
        var xv = dist * Math.cos(angle);
        var yv = dist * Math.sin(angle);
        if (i++ % 2 === 1) {
            this.graphics.moveTo(x - xv, y - yv);
        } else {
            this.graphics.lineTo(x - xv, y - yv);
        }
        if (i >= this.lineShape.length) i %= this.lineShape.length;
    }
    this.graphics.endFill();
};

/**
 * Causes a ~0.5s animation to play where the line moves into the target. The line is destroyed afterwards.
 */
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

/**
 * Moves the source towards the target. If the target is reached, the line is destroyed.
 */
Indicator.prototype.moveToTarget = function() {
    if (this.getDistance() < this.endSpeed) {
        this.destroy();
    } else {
        var angle = this.getAngle();
        this.source.x -= this.endSpeed * Math.cos(angle);
        this.source.y -= this.endSpeed * Math.sin(angle);
    }
}

/**
 * Changes the shape of the line.
 * @param {Object} shape - Can be either a String or an Array of Numbers. See the constructor for details.
 */
Indicator.prototype.setLineShape = function(shape) {
    if (!Array.isArray(this.lineShape)) {
        this.lineShape = this.processLineShape(shape);
    } else {
        this.lineLength = this.getShapeLength();
    }
};

/**
 * Calculates the total length of the shape of the line.
 */
Indicator.prototype.getShapeLength = function() {
    var length = 0;
    for (var i = 0; i < this.lineShape.length; i++) {
        length += this.lineShape[i];
    }
    return length;
};

/**
 * Converts a String shape into an Array of Numbers.
 * @param {String} shape - A String of space-separated integers.
 * @returns {Array} - An Array of Numbers.
 */
Indicator.prototype.processLineShape = function(shape) {
    var spl = shape.split(" ");
    var shape = [];
    for (var i = 0; i < spl.length; i++) {
        shape.push(parseInt(spl[i]));
    }
    return shape;
};

/**
 * @returns {Number} - The source X position and offset.
 */
Indicator.prototype.getSourceX = function() {
    return this.source.x + this.sourceOffsetX;
};

/**
 * @returns {Number} - The source Y position and offset.
 */
Indicator.prototype.getSourceY = function() {
    return this.source.y + this.sourceOffsetY;
};

/**
 * @returns {Number} - The target X position and offset.
 */
Indicator.prototype.getTargetX = function() {
    return this.target.x + this.targetOffsetX;
};

/**
 * @returns {Number} - The target Y position and offset.
 */
Indicator.prototype.getTargetY = function() {
    return this.target.y + this.targetOffsetY;
};

/**
 * @returns {Number} - The index of the shape to start on according to this indicators current position.
 */
Indicator.prototype.getStartingShape = function() {
    var dist = 0;
    var pos = Math.abs(this.lineOffset);
    for (var i = 0; i < this.lineShape.length; i++) {
        dist += this.lineShape[i];
        if (pos < dist) {
            return i;
        }
    }
    return 0;
};


/**
 * @returns {Number} - The distance to offset the first draw point of the line.
 */
Indicator.prototype.getStartingOffset = function() {
    var dist = 0;
    var pos = Math.abs(this.lineOffset);
    for (var i = 0; i < this.lineShape.length; i++) {
        dist += this.lineShape[i];
        if (pos < dist) {
            return pos - dist;
        }
    }
    return 0;
};

/**
 * @returns {Number} - The angle between this indicators' source and target.
 */
Indicator.prototype.getAngle = function() {
    return Math.atan2(this.getSourceY() - this.getTargetY(), this.getSourceX() - this.getTargetX());
};

/**
 * @returns {Number} - The distance between this indicators' source and target.
 */
Indicator.prototype.getDistance = function() {
    return Math.sqrt(Math.pow(this.getSourceX() - this.getTargetX(), 2) + Math.pow(this.getSourceY() - this.getTargetY(), 2));
};

/**
 * @returns {Boolean} - Whether this indicator has finished its ending animation.
 */
Indicator.prototype.hasEnded = function() {
    return this.graphics === undefined;
};

/**
 * Destroys this indicator.
 */
Indicator.prototype.destroy = function() {
    this.graphics.destroy();
    this.graphics = undefined;
};