var InsurancePlz = InsurancePlz || {};

/**
 * Holds all required data for the execution of a major event.
 * Major events are events that impact all companies and will be reported on the news.
 * In order to trigger an event the execute() function should be called.
 * A major event consists of a key (the name of the function in GameState that will execute the actions of this event), an array of headlines, an array of texts and a occurrence probability weight.
 * @params {Object} eventJSON - An Object containing the required data.
 */
InsurancePlz.MajorEvent = function(data) {
    this.key = data.key;
    this.headlines = data.headlines;
    this.texts = data.texts;
    this.weight = data.weight;
    //Sets up a link to the function that executes this event.
    this.execute = new Function("InsurancePlz.GameState.triggerMajorEvent_" + this.key + "()");
}

/**
 * @returns {Object} news - An object with a headline and text field containing the news for this event.
 */
InsurancePlz.MajorEvent.prototype.getNews = function() {
    return {
        "headline": this.headlines[Math.floor(Math.random() * this.headlines.length)],
        "body": this.texts[Math.floor(Math.random() * this.texts.length)]
    };
};

/**
 * @returns {String} key - The key of this event.
 */
InsurancePlz.MajorEvent.prototype.getKey = function() {
    return this.key;
};

/**
 * @returns {Number} weight - The weight of this event.
 */
InsurancePlz.MajorEvent.prototype.getWeight = function() {
    return this.weight;
};

/**
 * @params {String} eventJSON - A String representation of the majorEvents.json file.
 * @returns {Object[]} events - A list of all major event objects found in the given JSON.
 */
function createMajorEventsFromJSON(eventJSON) {
    var list = JSON.parse(eventJSON).events;
    var events = [];
    for (i = 0; i < list.length; i++) {
        events.push(new InsurancePlz.MajorEvent(list[i]));
    }
    return events;
}