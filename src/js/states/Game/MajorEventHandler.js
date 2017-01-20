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

//The following events trigger global security upgrades for a certain security key.
InsurancePlz.GameState.triggerMajorEvent_global_sec_nobyod = function() {
    this.globalSecurityUpgrade("nobyod");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_pwman = function() {
    this.globalSecurityUpgrade("pwman");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_websec = function() {
    this.globalSecurityUpgrade("websec");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_autoup = function() {
    this.globalSecurityUpgrade("autoup");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_firewall = function() {
    this.globalSecurityUpgrade("firewall");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_stafftrain = function() {
    this.globalSecurityUpgrade("stafftrain");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_riskaudit = function() {
    this.globalSecurityUpgrade("riskaudit");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_techadvice = function() {
    this.globalSecurityUpgrade("techadvice");
};
InsurancePlz.GameState.triggerMajorEvent_global_sec_servicecon = function() {
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

//The following events trigger global security vulnerabilities for a certain security key.
InsurancePlz.GameState.triggerMajorEvent_global_vuln_nobyod = function() {
    this.globalSecurityDowngrade("nobyod");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_pwman = function() {
    this.globalSecurityDowngrade("pwman");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_websec = function() {
    this.globalSecurityDowngrade("websec");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_autoup = function() {
    this.globalSecurityDowngrade("autoup");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_firewall = function() {
    this.globalSecurityDowngrade("firewall");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_stafftrain = function() {
    this.globalSecurityDowngrade("stafftrain");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_riskaudit = function() {
    this.globalSecurityDowngrade("riskaudit");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_techadvice = function() {
    this.globalSecurityDowngrade("techadvice");
};
InsurancePlz.GameState.triggerMajorEvent_global_vuln_servicecon = function() {
    this.globalSecurityDowngrade("servicecon");
};

/**
 * Sets the security level of the given key for every target to 0 (minimum).
 */
InsurancePlz.GameState.globalSecurityDowngrade = function(key) {
    for (var i = 0; i < this.targets.children.length; i++) {
        this.targets.children[i].data.securityVector[key] = 0;
    }
};