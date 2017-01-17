/**
 * Creates the Leaderboard. This is an entirely self-fulfilling game entity, no setup required.
 * Slightly unoptimized right now as it expects to receive ALL leaderboard entries, but this is only problematic after several thousand entries (outside of the current scope).
 * @constructor
 * @param {Object} data - A JSON object containing all leaderboard entries.
 * @param {Object} game - Required. A reference to the Phaser game.
 */
function Leaderboard(data, game) {
    // Initializing variables
    this.data = data;
    //temp fill
    this.data = [];
    for (var i=0;i<25;i++){
        this.data.push({"n":"User"+i, "s":Math.round(100000/(i+1))});
    }
    //
    this.game = game;
    this.heightMargin = 0.1 * this.game.height;
    this.widthMargin = 0.25 * this.game.width;
    this.innerOffset = 5;
    this.page = 1;
    this.controlsHeight = 50;
    this.entriesPerPage = 15;

    this.leftX = this.widthMargin + this.innerOffset*2;
    this.rightX = this.game.width - this.widthMargin - this.innerOffset*2;
    this.topY = this.heightMargin + this.innerOffset*2;
    this.bottomY = this.game.height - this.heightMargin - this.innerOffset*3 - this.controlsHeight;

    this.entryWidth = this.rightX - this.leftX;
    this.entryHeight = (this.bottomY - this.topY) / (this.entriesPerPage+1);
    this.textOffset = 5;

    // Display current page
    this.display();
}

Leaderboard.prototype.display = function(){
    this.destroy();
    if (this.texture === undefined){
        this.texture = this.generateSkeletonTexture();
    }
    this.panel = this.game.add.sprite(0, 0, this.texture);
    this.drawControls();
    this.drawEntries();
};


/**
 * Draws the panel and decoration of this Leaderboard and returns it as a texture.
 * Do not call this function, use display() instead.
 */
Leaderboard.prototype.generateSkeletonTexture = function(){
    panel = this.game.add.graphics(0, 0);

    // Draw the semi-transparent background
    panel.inputEnabled = true;
    panel.beginFill(0x000000, 0.5);
    panel.drawRect(
        0,
        0,
        this.game.width,
        this.game.height
    );
    panel.endFill();

    // Draw the panel
    panel.beginFill(0x000000);
    panel.drawRect(
        this.widthMargin,
        this.heightMargin,
        this.game.width - this.widthMargin*2,
        this.game.height - this.heightMargin*2
    );
    panel.endFill();

    // Draw outline
    panel.moveTo(this.widthMargin, this.heightMargin);
    panel.lineStyle(2, 0xBBFA27);
    panel.lineTo(
        this.game.width - this.widthMargin,
        this.heightMargin
    );
    panel.lineTo(
        this.game.width - this.widthMargin,
        this.game.height - this.heightMargin
    );
    panel.lineTo(
        this.widthMargin,
        this.game.height - this.heightMargin
    );
    panel.lineTo(
        this.widthMargin,
        this.heightMargin
    );
    panel.endFill();

    // Draw the inner line
    panel.moveTo(this.leftX - this.innerOffset, this.topY - this.innerOffset);
    panel.lineStyle(1, 0xBBFA27);
    panel.lineTo(
        this.rightX + this.innerOffset,
        this.topY - this.innerOffset
    );
    panel.lineTo(
        this.rightX + this.innerOffset,
        this.game.height - this.heightMargin - this.innerOffset
    );
    panel.lineTo(
        this.leftX - this.innerOffset,
        this.game.height - this.heightMargin - this.innerOffset
    );
    panel.lineTo(
        this.leftX - this.innerOffset,
        this.topY - this.innerOffset
    );

    // Draw the line around the entries
    panel.moveTo(this.leftX, this.topY);
    panel.lineStyle(1, 0x999999, 0.7);
    panel.lineTo(
        this.rightX,
        this.topY
    );
    panel.lineTo(
        this.rightX,
        this.bottomY
    );
    panel.lineTo(
        this.leftX,
        this.bottomY
    );
    panel.lineTo(
        this.leftX,
        this.topY
    );

    // Draw header line
    panel.lineStyle(1, 0xBBFA27);
    panel.moveTo(
        this.leftX,
        this.topY + this.entryHeight
    );
    panel.lineTo(
        this.rightX,
        this.topY + this.entryHeight
    );

    // Draw highlights
    panel.beginFill(0xFFFFFF, 0.1);
    panel.lineStyle();
    for (var i=1; i<this.entriesPerPage; i=i+2){
        panel.drawRect(
            this.leftX,
            this.topY + this.entryHeight*i,
            this.entryWidth,
            this.entryHeight
        );
    }
    panel.endFill();

    // Draw entry dividers
    panel.lineStyle(1, 0x999999, 0.7);
    for (var i=0; i<this.entriesPerPage-1; i++){
        panel.moveTo(
            this.leftX,
            this.topY + this.entryHeight*2 + this.entryHeight*i
        );
        panel.lineTo(
            this.rightX,
            this.topY + this.entryHeight*2 + this.entryHeight*i
        );
    }

    // Draw stat standing divider
    panel.moveTo(
        this.leftX + 0.15*this.entryWidth,
        this.topY
    );
    panel.lineTo(
        this.leftX + 0.15*this.entryWidth,
        this.bottomY
    );

    //Draw score divider
    panel.moveTo(
        this.leftX + 0.7*this.entryWidth,
        this.topY
    );
    panel.lineTo(
        this.leftX + 0.7*this.entryWidth,
        this.bottomY
    );

    var texture = panel.generateTexture();
    panel.destroy();
    return texture;
};

/**
 * Draws and initializes the control buttons of this Leaderboard.
 * Do not call this function, use display() instead.
 */
Leaderboard.prototype.drawControls = function(){
    this.controls = this.game.add.group();
    this.controls.x = this.game.width/2;
    this.controls.y = this.game.height - this.heightMargin - this.innerOffset*2 - this.controlsHeight/2;

    var btn = this.controls.add(this.game.add.button(0, 0, 'button', this.destroy, this));
    btn.anchor.setTo(0.5);

    var txt = btn.addChild(this.game.make.text(
        0,
        3,
        "Close",
        {
            color: 'white',
            fill: '#fff',
            align: 'center'
        }
    ));
    txt.anchor.setTo(0.5);

    if (this.hasNextPage()){
        btn = this.controls.add(this.game.add.button(150, 0, 'page-next', this.nextPage, this));
        btn.anchor.setTo(0.5);
    }

    if (this.hasPreviousPage()){
        btn = this.controls.add(this.game.add.button(-150, 0, 'page-prev', this.previousPage, this));
        btn.anchor.setTo(0.5);
    }
};

/**
 * Draws the leaderboard entries of the current page.
 * Do not call this function, use display() instead.
 */
Leaderboard.prototype.drawEntries = function(){
    this.entries = this.game.add.group();
    this.entries.x = this.leftX;
    this.entries.y = this.topY;

    var headerstyle = {
        fill: '#FFF',
    };

    var oddstyle = {
        fill: '#CCC'
    };

    var evenstyle = {
        fill: '#999'
    };

    this.entries.add(this.game.make.text(this.textOffset, 0, "Rank", headerstyle));
    this.entries.add(this.game.make.text(0.15 * this.entryWidth + this.textOffset, 0, "Name", headerstyle));
    this.entries.add(this.game.make.text(0.7 * this.entryWidth + this.textOffset, 0, "Score", headerstyle));

    var start = this.entriesPerPage * (this.page - 1);
    var end = Math.min(this.entriesPerPage * (this.page), this.data.length);
    var pos = 1;
    for (var i=start; i<end; i++){
        var style = pos%2===0 ? evenstyle : oddstyle;
        this.entries.add(this.game.make.text(this.textOffset, pos*this.entryHeight, "#" + (i+1), style));
        this.entries.add(this.game.make.text(0.15 * this.entryWidth + this.textOffset, pos*this.entryHeight, this.data[i].n, style));
        this.entries.add(this.game.make.text(0.7 * this.entryWidth + this.textOffset, pos*this.entryHeight, this.formatScore(this.data[i].s), style));
        pos++;
    }
};

/**
 * Callback function that will cause this leaderboard to display the next page (if able).
 */
Leaderboard.prototype.nextPage = function(){
    if (this.hasNextPage()){
        this.page++;
        this.display();
    }
};

/**
 * Callback function that will cause this leaderboard to display the previous page (if able).
 */
Leaderboard.prototype.previousPage = function(){
    if (this.hasPreviousPage()){
        this.page--;
        this.display();
    }
};

/**
 * @params {Number} c - A number to format in typical cash format.
 * @returns {String} - A string representation of the number with $ and comma's added appropriately.
 */
Leaderboard.prototype.formatScore = function(c) {
    return '$' + c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * @returns {Number} - The number of pages this leaderboard has to display.
 */
Leaderboard.prototype.numberOfPages = function(){
    return Math.ceil(this.data.length / this.entriesPerPage);
};

/**
 * @returns {Boolean} - Whether this leaderboard has a next page to display.
 */
Leaderboard.prototype.hasNextPage = function(){
    return this.page < this.numberOfPages();
};

/**
 * @returns {Boolean} - Whether this leaderboard has a previous page to display.
 */
Leaderboard.prototype.hasPreviousPage = function(){
    return this.page > 1;
};

/**
 * Destroys all assets except for the texture. To destroy the texture as well, use close() instead.
 */
Leaderboard.prototype.destroy = function(){
    if (this.panel!=null) this.panel.destroy();
    if (this.controls!=null) this.controls.destroy();
    if (this.entries!=null) this.entries.destroy();
};

/**
 * Destroys all assets, including the texture. To not destroy the texture, use destroy() instead.
 */
Leaderboard.prototype.close = function(){
    if (this.texture!=null) this.texture.destroy();
    if (this.panel!=null) this.panel.destroy();
    if (this.controls!=null) this.controls.destroy();
    if (this.entries!=null) this.entries.destroy();
};