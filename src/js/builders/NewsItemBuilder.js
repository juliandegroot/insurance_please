var InsurancePlz = InsurancePlz || {};

/**
 * Builder class which can create news items based on provided information.
 * Needs a reference to the main game and the news snippets from which the
 * news items can be build.
 * @param {String} newsJSON - A JSON String containing all the news snippets.
 */
InsurancePlz.NewsItemBuilder = function(newsJSON) {
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
    newsitem.headline = this.generateHeadline(eventInformation);
    newsitem.body = this.generateNewsBody(eventInformation);
    return newsitem;
}

/**
 * Create a random headline based on the event information.
 * @param {Object} eventInformation - The information on the event.
 * @return {String} - The generated headline.
 */
InsurancePlz.NewsItemBuilder.prototype.generateHeadline = function(eventInformation) {
    var headlines = this.newsSnippets.headlines.general.concat(
        this.newsSnippets.headlines[eventInformation.attackID]);
    return this.replaceAllTags(this.chooseRandomString(headlines), eventInformation);
}

/**
 * Generate a random news body based on the event information.
 * @param {Object} eventInformation - The information on the event.
 * @return {String} - The generated news body.
 */
InsurancePlz.NewsItemBuilder.prototype.generateNewsBody = function(eventInformation) {
    var intro = this.chooseCategorySentence("intro", eventInformation.attackID);
    var body = intro + " " + this.chooseDamageSentence();
    return this.replaceAllTags(body, eventInformation);
}

/**
 * Choose a random sentence from a category. The sentences chosen from are the general entry
 * for that category combined with the entries for the specified id for the category.
 * @param {String} category - The category to draw sentences from.
 * @param {String} id - The id to combine with the general entries.
 */
InsurancePlz.NewsItemBuilder.prototype.chooseCategorySentence = function(category, id) {
    // TODO: null check on category and id
    var options = this.newsSnippets[category].general.concat(
        this.newsSnippets[category][id]
    );
    return this.chooseRandomString(options);
}

// TODO: this might change depending on the stories.
InsurancePlz.NewsItemBuilder.prototype.chooseDamageSentence = function() {
    return this.chooseRandomString(this.newsSnippets.damage);
}

/**
 * Choose a random String from the array of Strings.
 * @param {Array} array - The array of strings to choose from.
 * @return {String} - The random chosen string.
 */
InsurancePlz.NewsItemBuilder.prototype.chooseRandomString = function(array) {
    // TODO: length == 0 check?
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Replace all the tags in the provided string with the information of the attack event.
 * @param {String} string - String in which all the tags should be replaced.
 * @param {Object} eventInformation - The object with the information of the event.
 * @return {String} - The string with all tags replaced with the event information.
 */
InsurancePlz.NewsItemBuilder.prototype.replaceAllTags = function(string, eventInformation) {
    string = this.replaceCompanyTag(string, eventInformation.companyName);
    string = this.replaceAttackTag(string, eventInformation.attackName);
    string = this.replaceDamageTag(string, eventInformation.damage);
    string = this.replaceReductionTag(string, eventInformation.reduction);
    return string;
}

/**
 * Replace the company tag %c in the provided string with the company name.
 * @param {String} string - String in which it should be replaced.
 * @param {String} companyName - The company name to replace it with.
 */
InsurancePlz.NewsItemBuilder.prototype.replaceCompanyTag = function(string, companyName) {
    return string.replace(new RegExp("%CN", 'g'), companyName);
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
    return string.replace(new RegExp("%CDMG", 'g'), damage);
}

/**
 * Replace the reduction tag %c in the provided string with the reduction name.
 * @param {String} string - String in which it should be replaced.
 * @param {String} reduction - The reduction name to replace it with.
 */
InsurancePlz.NewsItemBuilder.prototype.replaceReductionTag = function(string, reduction) {
    return string.replace(new RegExp("%r", 'g'), reduction);
}
