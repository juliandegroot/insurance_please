var InsurancePlz = InsurancePlz || {};

InsurancePlz.MajorEvent = function(data) {
  this.key = data.key;
  this.headline = data.headline;
  this.text = data.text;
  this.weight = data.weight;
}

/**
* Creates the popup for this event and returns the popup object.
* @returns {Popup} popup - The popup created.
*/
InsurancePlz.MajorEvent.prototype.execute = function() {
  new Function("InsurancePlz.GameState.triggerMajorEvent_" + this.key + "()")();
  return {"headline":this.headline,"text":this.text};
};

/**
* @returns {String} key - The key of this event.
*/
InsurancePlz.MajorEvent.prototype.getKey = function() {
  return this.key;
};

/**
* @returns {String} key - The key of this event.
*/
InsurancePlz.MajorEvent.prototype.getWeight = function() {
  return this.weight;
};

/**
* @params {String} eventJSON - A String representation of the majorEvents.json file.
* @returns {Object[]} events - A list of all major event objects found in the given JSON.
*/
function createMajorEventsFromJSON(eventJSON){
  let list = JSON.parse(eventJSON).events;
  var events = [];
  for (i = 0; i < list.length; i++) {
    events.push(new InsurancePlz.MajorEvent(list[i]));
  }
  return events;
}
