var InsurancePlz = InsurancePlz || {};


/**
* Creates a popup with the given headline and text in the center of the screen.
* @constructor
* @param {String} headline - The headline of the popup.
* @param {Number} text - The content of the popup.
*/
function Popup(headline, text){
	//Create group to hold the sprites
	this.group = InsurancePlz.game.add.group();
	//Create array to hold the buttons
	this.buttons = [];

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
		'popuppanel'
	);
	this.panel.anchor.setTo(0.5);

	//Headline style
	var headlineStyle = {
	  color: 'white',
	  font: '24px HackerFont',
	  fill: '#fff',
	  align: 'center'
	};

	//Message text. Can be changed to also use anchor(0.5) to center vertically
	this.headline = this.panel.addChild(InsurancePlz.game.make.text(
		0,
		-this.panel.height/2+20,
		headline,
		headlineStyle
	));
	//Center the headline
	this.headline.x = -this.headline.width/2;

	//Text style
	var textStyle = {
	  color: 'white',
	  font: '14px HackerFont',
	  fill: '#fff',
	  align: 'center',
	  wordWrap: true,
	  wordWrapWidth: this.panel.width-20
	};

	//Message text. Can be changed to also use anchor(0.5) to center vertically
	this.message = this.panel.addChild(InsurancePlz.game.make.text(
		-this.panel.width/2+20,
		-this.panel.height/2+50,
		text,
		textStyle
	));

	this.group.add(this.background);
	this.group.add(this.panel);
}

/**
* Adds a button to the current popup.
* Popups currently do not support more than 2 buttons.
* @param {String} text - The text that the button should display.
* @param {Object} callback - The callback to be used when the button is pressed.
* @param {Object} context - The context to be used in the callback.
*/
Popup.prototype.addButton = function(text, callback, context){
	if (this.buttons.length>=2){
		console.log('ERROR: Popups currently do not support more than 2 buttons.');
		return;
	}

	var button = this.panel.addChild(InsurancePlz.game.make.button(
		0,
		this.panel.height/2-20,
		'button',
		callback,
		context
	));
	button.y = button.y - button.height/2;
	button.anchor.setTo(0.5);

    //Text style
    var style = {
      color: 'white',
      fill: '#fff',
      align: 'center',
    };

	var buttonTxt = button.addChild(InsurancePlz.game.make.text(
		0,
		3,
		text,
		style
	));
	buttonTxt.anchor.setTo(0.5);

	this.buttons.push(button);
	this.organizeButtons();
}

/**
* Automatic function that is called whenever buttons are changed.
* Responsible for ensuring all buttons are aligned nicely.
*/
Popup.prototype.organizeButtons = function(){
	var startPoint = -(this.buttons[0].width*this.buttons.length+20*(this.buttons.length-1))/2;
	console.log(startPoint);
	for (var i=0;i<this.buttons.length;i++){
		this.buttons[i].x = startPoint + 20*i + this.buttons[0].width*(i+0.5);
		console.log(this.buttons[i].x);
	}
}

/**
* Remove this popup and all sprite elements connected with it.
*/
Popup.prototype.destroy = function(){
	this.group.destroy();
}