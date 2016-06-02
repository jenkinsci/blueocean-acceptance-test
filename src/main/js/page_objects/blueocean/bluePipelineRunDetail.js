// Blue Ocean pipeline run detail page object (http://nightwatchjs.org/guide#page-objects)

module.exports = {
    elements: {
        logHeader: '.dialog .log-header',
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    forRun: function(jobName, branchName, buildNumber) {
        this.jobName = jobName;
        this.branchName = (typeof branchName === 'string' ? branchName : jobName);
        this.buildNumber = (typeof branchName === 'number' ? branchName : buildNumber);
        return this.navigate(this.pageUrl());
    },
    pageUrl: function(relative) {
        return (!relative ? this.api.launchUrl : '/') + 'blue/pipelines/' + this.jobName + '/detail/' + this.branchName + '/' + this.buildNumber;
    },
    tabUrl: function(tabName, relative) {
        return this.pageUrl(relative) + '/' + tabName;
    },
    tabSelector: function(tabName) {
        return 'nav.page-tabs a[href="' + this.tabUrl(tabName, true) + '"]';
    },
    assertBasicLayoutOkay: function() {
        this.waitForElementVisible(this.tabSelector('pipeline'), 5000); // Give a bit more time to initially appear
        this.waitForElementVisible(this.tabSelector('changes'), 1000);
        this.waitForElementVisible(this.tabSelector('tests'), 1000);
        this.waitForElementVisible(this.tabSelector('artifacts'), 1000);
        this.waitForElementVisible('@logHeader', 1000);
        // TODO: add class info to the page content so we can test it
        // Atm there's very little on the page that will allow us to test it.
        // E.g. nothing on the pipeline graph that allows us to find it.
    }
}];