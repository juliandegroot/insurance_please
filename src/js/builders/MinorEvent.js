var InsurancePlz = InsurancePlz || {};

/**
 * Holds all required data for the execution of a minor event.
 * Minor events are events that impact a single comapny and will not be reported on the news.
 * In order to trigger an event the execute() function should be called.
 * A minor event consists of a key (the name of the function in GameState that will execute the actions of this event) and an occurrence probability weight.
 * @params {Object} eventJSON - An Object containing the required data.
 */
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
function createMinorEventsFromJSON(eventJSON) {
    var list = JSON.parse(eventJSON).events;
    var events = [];
    for (i = 0; i < list.length; i++) {
        events.push(new InsurancePlz.MinorEvent(list[i]));
    }
    return events;
}