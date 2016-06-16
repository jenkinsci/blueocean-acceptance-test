// Blue Ocean pipeline run detail page object (http://nightwatchjs.org/guide#page-objects)

var url = require('../../util/url');

module.exports = {
    elements: {
        logHeader: '.dialog .log-header',
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    forRun: function(jobName, orgName, branchName, buildNumber) {
        this.jobName = jobName;
        this.orgName = orgName;
        this.branchName = (typeof branchName === 'string' ? branchName : jobName);
        this.buildNumber = (typeof branchName === 'number' ? branchName : buildNumber);
        return this.navigate(this.pageUrl());
    },
    pageUrl: function(relative) {
        var runUrl =  url.makeRelative(url.viewRunPipeline(this.orgName, this.jobName, this.branchName, this.buildNumber));
        
        return !relative ?
            this.api.launchUrl + runUrl :
            runUrl;
    },
    tabUrl: function(tabName, relative) {
        return this.pageUrl(relative) + '/' + tabName;
    },
    tabSelector: function(tabName) {
        return 'nav.page-tabs a[href="' + this.tabUrl(tabName, true) + '"]';
    },
    assertBasicLayoutOkay: function() {
        this.waitForElementVisible(this.tabSelector('pipeline'));
        this.waitForElementVisible(this.tabSelector('changes'));
        this.waitForElementVisible(this.tabSelector('tests'));
        this.waitForElementVisible(this.tabSelector('artifacts'));
        this.waitForElementVisible('@logHeader');
        // TODO: add class info to the page content so we can test it
        // Atm there's very little on the page that will allow us to test it.
        // E.g. nothing on the pipeline graph that allows us to find it.
    }
}];