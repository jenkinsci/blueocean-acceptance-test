// Blue Ocean pipelines page object (http://nightwatchjs.org/guide#page-objects)

module.exports = {
    elements: {
        pipelinesNav: '.global-header nav a[href="/blue/pipelines"]',
        emptyStateShoes: '.empty-state .empty-state-icon.shoes',
        activityTable: '.activity-table',
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    forJob: function(jobName) {
        var pageUrl = this.api.launchUrl + 'blue/pipelines/' + jobName + '/activity';
        this.jobName = jobName;
        return this.navigate(pageUrl);
    },
    assertBasicLayoutOkay: function() {
        this.waitForElementVisible('@pipelinesNav', 1000);
        this.waitForElementVisible('nav.page-tabs a[href="/blue/pipelines/' + this.jobName + '/activity"]', 1000);
        this.waitForElementVisible('nav.page-tabs a[href="/blue/pipelines/' + this.jobName + '/branches"]', 1000);
        this.waitForElementVisible('nav.page-tabs a[href="/blue/pipelines/' + this.jobName + '/pr"]', 1000);
    },
    waitForRunVisible: function(runName) {
        this.waitForElementVisible('.activity-table tr#' + runName, 1000);
        this.waitForElementVisible('.activity-table tr#' + runName + ' svg.svgResultStatus', 1000);
        this.waitForElementPresent('.activity-table tr#' + runName + ' svg circle.success', 1000);
    }
}];