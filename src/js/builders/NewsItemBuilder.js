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

InsurancePlz.NewsItemBuilder.prototype.constructor = InsurancePlz.NewsItemBuilder;

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

/**
 * Replace the company tag %c in the provided string with the company name.
 * @param {String} string - String in which it should be replaced.
 * @param {String} companyName - The company name to replace it with.
 */
InsurancePlz.NewsItemBuilder.prototype.replaceCompanyTag = function(string, companyName) {
  return string.replace(new RegExp("%c", 'g'), companyName);
}

/**
 * Replace the attack tag %a in the provided string with the attack name.
 * @param {String} string - String in which it should be replaced.
 * @param {String} attackName - The attack name to replace it with.
 */
InsurancePlz.NewsItemBuilder.prototype.replaceAttackTag = function(string, attackName) {
  return string.replace(new RegExp("%a", 'g'), attackName);
}

/**
 * Replace the damage tag %d in the provided string with the damage amount.
 * @param {String} string - String in which it should be replaced.
 * @param {Number} damage - The damage amount to replace it with.
 */
InsurancePlz.NewsItemBuilder.prototype.replaceDamageTag = function(string, damage) {
  return string.replace(new RegExp("%d", 'g'), damage);
}

/**
 * Replace the reduction tag %c in the provided string with the reduction name.
 * @param {String} string - String in which it should be replaced.
 * @param {String} reduction - The reduction name to replace it with.
 */
InsurancePlz.NewsItemBuilder.prototype.replaceReductionTag = function(string, reduction) {
  return string.replace(new RegExp("%r", 'g'), reduction);
}
