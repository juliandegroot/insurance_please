var InsurancePlz = InsurancePlz || {};

InsurancePlz.MinorEvent = function(data) {
  this.key = data.key;
  this.weight = data.weight;
  //Sets up a link to the function that executes this event.
  this.execute = new Function("InsurancePlz.GameState.triggerMinorEvent_" + this.key + "()");
}

/**
* @returns {String} key - The key of this event.
*/
InsurancePlz.MinorEvent.prototype.getKey = function() {
  return this.key;
};

/**
* @returns {Number} weight - The weight of this event.
*/
InsurancePlz.MinorEvent.prototype.getWeight = function() {
  return this.weight;
};

/**
* @params {String} eventJSON - A String representation of the minorEvents.json file.
* @returns {Object[]} events - A list of all minor event objects found in the given JSON.
*/
function createMinorEventsFromJSON(eventJSON){
  let list = JSON.parse(eventJSON).events;
  var events = [];
  for (i = 0; i < list.length; i++) {
    events.push(new InsurancePlz.MinorEvent(list[i]));
  }
  return events;
}
