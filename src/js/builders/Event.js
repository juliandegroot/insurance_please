var InsurancePlz = InsurancePlz || {};

InsurancePlz.Event = function(data) {
  this.key = data.key;
  this.headline = data.headline;
  this.text = data.text;
  this.buttonTexts = data.buttonTexts;
  this.buttonCallbacks = data.buttonCallbacks;
  if (this.buttonTexts.length!==this.buttonCallbacks.length){
    console.log("WARNING: Event " + this.key + " does not have an equal number of button texts and callbacks.");
  }
}

/**
* Creates the popup for this event and returns the popup object.
* @returns {Popup} popup - The popup created.
*/
InsurancePlz.Event.prototype.createPopup = function() {
  var popup = new Popup(this.headline, this.text);
  for (var i=0;i<this.buttonTexts.length;i++){
    popup.addButton(this.buttonTexts[i], new Function("InsurancePlz.GameState." + this.buttonCallbacks[i] + "()"), InsurancePlz.GameState);
  }
  return popup;
};

/**
* @returns {String} key - The key of this event.
*/
InsurancePlz.Event.prototype.getKey = function() {
  return this.key;
};

/**
* @params {String} eventJSON - A String representation of the event.json file.
* @returns {InsurancePlz.Event[]} events - A list of all event objects found in the given JSON.
*/
function createEventsFromJSON(eventJSON){
  let list = JSON.parse(eventJSON).events;
  var events = [];
  for (i = 0; i < list.length; i++) {
    events.push(new InsurancePlz.Event(list[i]));
  }
  return events;
}