var InsurancePlz = InsurancePlz || {};

/**
 * Creates a Popup with the given headline and text in the center of the screen.
 * A button can either be added immediately through the last 3 parameters, or by calling the addButton command.
 * @constructor
 * @param {String} headline - The headline of the Popup. Either a String or an Array of Strings (will be split into pages). Will currently go out of bounds at more than ~25 characters.
 * @param {Object} text - The content of the Popup. Either a String or an Array of Strings (will be split into pages).
 * @param {String} panelname - The name of the sprite to use as background for the panel.
 * @param {String} btnText - Optional. The text for the main button.
 * @param {Function} callback - Optional. A function to call when the primary button is clicked.
 * @param {Object} context - Optional. The context for the callback.
 */
function Popup(headline, text, panelname, btnText, callback, context) {
    // Save parameters
    this.headline = headline;
    this.text = text;
    this.panelname = panelname;
    this.btnText = btnText;
    this.callback = callback;
    this.context = context;

    //Create group to hold the sprites
    this.group = InsurancePlz.game.add.group();

    // Initialize variables
    this.buttonArgs = [];
    this.buttons = [];
    this.page = 0;
    this.offset = 20;

    this.display();
}

/**
 * Draws the display elements for this Popup.
 */
Popup.prototype.display = function(){
    //Soft destroy
    this.group.destroy(true, true);

    //Create background
    this.background = InsurancePlz.game.add.graphics(0, 0);
    this.background.inputEnabled = true;
    this.background.beginFill(0x000000, 0.5);
    this.background.drawRect(
        0,
        0,
        InsurancePlz.game.width,
        InsurancePlz.game.height
    );
    this.background.endFill();

    //Create popup panel
    this.panel = InsurancePlz.game.add.sprite(
        InsurancePlz.game.world.centerX,
        InsurancePlz.game.world.centerY,
        this.panelname
    );
    this.panel.anchor.setTo(0.5);

    //Headline style
    var headlineStyle = {
        color: 'white',
        font: '28px ZrNic',
        fill: '#fff',
        align: 'center'
    };

    //Headline text. Can be changed to also use anchor(0.5) to center vertically
    this.headlineLabel = this.panel.addChild(InsurancePlz.game.make.text(
        0, (-this.panel.height + this.offset) / 2,
        this.getHeadline(),
        headlineStyle
    ));
    this.headlineLabel.x = -this.headlineLabel.width / 2;

    //Text style
    var textStyle = {
        color: 'white',
        font: '18px ZrNic',
        fill: '#fff',
        align: 'left',
        wordWrap: true,
        wordWrapWidth: this.panel.width - 2 * this.offset
    };

    //Message text. Can be changed to also use anchor(0.5) to center vertically
    this.textLabel = this.panel.addChild(InsurancePlz.game.make.text(-this.panel.width / 2 + this.offset, -this.panel.height / 2 + 50,
        this.getText(),
        textStyle
    ));

    this.group.add(this.background);
    this.group.add(this.panel);

    this.displayButtons();
    this.displayPageControls();
};

/**
 * Draws the button if one is supplied.
 */
Popup.prototype.displayButtons = function(){
    // Destroy existing button
    for (var i=0;i<this.buttons.length;i++){
        this.buttons[i].destroy();
    }
    this.buttons = [];

    //Text style
    var style = {
        color: 'white',
        fill: '#fff',
        align: 'center',
    };

    for (var i=0;i<this.buttonArgs.length;i++){
        this.buttons.push(this.panel.addChild(InsurancePlz.game.make.button(
            0,
            this.panel.height / 2 - this.offset - 30,
            'button',
            this.buttonArgs[i].callback,
            this.buttonArgs[i].context
        )));
        this.buttons[i].anchor.setTo(0.5);

        var buttonText = this.buttons[i].addChild(InsurancePlz.game.make.text(
            0,
            3,
            this.buttonArgs[i].text,
            style
        ));
        buttonText.anchor.setTo(0.5);
    }
    this.organizeButtons();
}

/**
 * Draws the page control elements of this Popup if necessary.
 */
Popup.prototype.displayPageControls = function(){
    if (this.hasPreviousPage()){
        this.prevBtn = this.panel.addChild(InsurancePlz.game.add.button(
            -150 * this.buttons.length,
            this.panel.height / 2 - this.offset - 30,
            'page-prev',
            this.previousPage,
            this
        ));
        this.prevBtn.anchor.setTo(0.5);
    }

    if (this.hasNextPage()){
        this.nextBtn = this.panel.addChild(InsurancePlz.game.add.button(
            150 * this.buttons.length,
            this.panel.height / 2 - this.offset - 30,
            'page-next',
            this.nextPage,
            this
        ));
        this.nextBtn.anchor.setTo(0.5);
    }
};

/**
 * Adds a button to the current Popup.
 * If the Popup already has a button, it is replaced instead.
 * @param {String} text - The text that the button should display.
 * @param {Object} callback - The callback to be used when the button is pressed.
 * @param {Object} context - The context to be used in the callback.
 */
Popup.prototype.addButton = function(text, callback, context){
    if (this.buttons.length >= 2) {
        console.log('ERROR: Popups currently do not support more than 2 buttons.');
        return;
    }

    this.buttonArgs.push({
        "text": text,
        "callback": callback,
        "context": context
    });
    this.displayButtons();
};

/**
 * Automatic function that is called whenever buttons are changed.
 * Responsible for ensuring all buttons are aligned nicely.
 */
Popup.prototype.organizeButtons = function() {
    //If there is nothing to organize, return
    if (this.buttonArgs.length===0) return;

    if (this.prevBtn!=null) this.prevBtn.destroy();
    if (this.nextBtn!=null) this.nextBtn.destroy();
    var startPoint = -(this.buttons[0].width * this.buttons.length + this.offset * (this.buttons.length - 1)) / 2;
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].x = startPoint + this.offset * i + this.buttons[0].width * (i + 0.5);
    }
    this.displayPageControls();
};

/**
 * Remove this Popup and all sprite elements connected with it.
 */
Popup.prototype.destroy = function() {
    this.group.destroy();
};

Popup.prototype.getHeadline = function(){
    return Array.isArray(this.headline) ? this.headline[this.page] : this.headline;
}

Popup.prototype.getText = function(){
    return Array.isArray(this.text) ? this.text[this.page] : this.text;
}

/**
 * Callback function that will cause this leaderboard to display the next page (if able).
 */
Popup.prototype.nextPage = function(){
    if (this.hasNextPage()){
        this.page++;
        this.display();
    }
};

/**
 * Callback function that will cause this leaderboard to display the previous page (if able).
 */
Popup.prototype.previousPage = function(){
    if (this.hasPreviousPage()){
        this.page--;
        this.display();
    }
};

/**
 * @returns {Boolean} - Whether this popup has a next page to display.
 */
Popup.prototype.hasNextPage = function(){
    return Array.isArray(this.text) ? this.page < this.text.length - 1 : false;
};

/**
 * @returns {Boolean} - Whether this popup has a previous page to display.
 */
Popup.prototype.hasPreviousPage = function(){
    return Array.isArray(this.text) ? this.page > 0 : false;
};