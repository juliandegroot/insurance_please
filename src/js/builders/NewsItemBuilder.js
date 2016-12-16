var InsurancePlz = InsurancePlz || {};

/**
 * Builder class which can create news items based on provided information.
 * Needs a reference to the main game and the news snippets from which the
 * news items can be build.
 * @param {Object} state - Reference to the main game Object.
 * @param {String} newsJSON - A JSON String containing all the news snippets.
 */
InsurancePlz.NewsItemBuilder = function(state, newsJSON) {
  this.newsSnippets = newsJSON;
}

/**
 * Takes an array of event information and generates an array of news items
 * based on the event information and the stored news snippets.
 * @param {Array} infoArray - The array containing the information to generate the news on.
 * @return {Array} - The array containing the news items on the events.
 */
InsurancePlz.NewsItemBuilder.prototype.generateNewsItems = function(infoArray) {
  var res = [];
  for (var i = 0; i < infoArray.length; i++) {
    res.push(this.generateNewsItem(infoArray[i]));
  }
  return res;
}

/**
 * Takes a single event information object and returns a generated news item based
 * on the event information and stored news snippets.
 * @param {Object} eventInformation - The object with the information on the event.
 * @return {Object} - The generated news item.
 */
InsurancePlz.NewsItemBuilder.prototype.generateNewsItem = function(eventInformation) {
  var newsitem = {};
  // TODO: create the actual news, nows still waiting for the requirements
  return newsitem;
}
