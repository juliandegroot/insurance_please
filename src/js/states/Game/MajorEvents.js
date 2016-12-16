/**
 * Executes a major event and adds it to the list of news items events.
 * Decides which event to trigger using a roulette system based on the weights of each event.
 */
InsurancePlz.GameState.triggerMajorEvent = function() {
    var roulette = [];
    for (var i = 0; i < this.majorEventList.length; i++) {
        for (var j = 0; j < this.majorEventList[i].getWeight(); j++) {
            roulette.push(i);
        }
    }
    if (roulette.length > 0) {
        var rand = Math.floor(Math.random() * roulette.length);
        //TODO: Add result to news list
        var news = this.majorEventList[rand].getNews();
        this.gameProgress.newsarray.push({
            round: this.gameProgress.turn,
            type: "event",
            headline: news.headline,
            body: news.body
        });
        //Execute event
        this.majorEventList[roulette[rand]].execute();
        //Prevent event from being executed again
        this.majorEventList.splice(i, i);
    }
};

InsurancePlz.GameState.triggerMajorEvent_global_iot = function() {
    this.globalSecurityUpgrade("iot");
};
InsurancePlz.GameState.triggerMajorEvent_global_nobyod = function() {
    this.globalSecurityUpgrade("nobyod");
};
InsurancePlz.GameState.triggerMajorEvent_global_pwman = function() {
    this.globalSecurityUpgrade("pwman");
};
InsurancePlz.GameState.triggerMajorEvent_global_websec = function() {
    this.globalSecurityUpgrade("websec");
};
InsurancePlz.GameState.triggerMajorEvent_global_autoup = function() {
    this.globalSecurityUpgrade("autoup");
};
InsurancePlz.GameState.triggerMajorEvent_global_firewall = function() {
    this.globalSecurityUpgrade("firewall");
};
InsurancePlz.GameState.triggerMajorEvent_global_stafftrain = function() {
    this.globalSecurityUpgrade("stafftrain");
};
InsurancePlz.GameState.triggerMajorEvent_global_riskaudit = function() {
    this.globalSecurityUpgrade("riskaudit");
};
InsurancePlz.GameState.triggerMajorEvent_global_techadvice = function() {
    this.globalSecurityUpgrade("techadvice");
};
InsurancePlz.GameState.triggerMajorEvent_global_servicecon = function() {
    this.globalSecurityUpgrade("servicecon");
};

/**
 * Sets the security level of the given key for every target to 1 (maximum).
 */
InsurancePlz.GameState.globalSecurityUpgrade = function(key) {
    for (var i = 0; i < this.targets.children.length; i++) {
        this.targets.children[i].data.securityVector[key] = 1;
    }
};