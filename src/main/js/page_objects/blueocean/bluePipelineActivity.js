// Blue Ocean pipelines page object (http://nightwatchjs.org/guide#page-objects)

module.exports = {
    elements: {
        pipelinesNav: '.global-header nav a[href="/blue/pipelines"]',
        emptyStateShoes: '.empty-state .empty-state-icon.shoes',
        activityTable: '.activity-table',
    }
};

function createBaseUrl(jobName, orgName) {
    return 'blue/organizations/' + orgName + '/' + jobName;
}

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    forJob: function(jobName, orgName) {
        var pageUrl = this.api.launchUrl + createBaseUrl(jobName, orgName) + '/activity';
        this.jobName = jobName;
        this.orgName = orgName;
        return this.navigate(pageUrl);
    },
    assertBasicLayoutOkay: function() {
        var baseHref = '/' + createBaseUrl(this.jobName, this.orgName);
        this.waitForElementVisible('@pipelinesNav', 1000);
        this.waitForElementVisible('.page-tabs a[href="' + baseHref + '/activity"]', 1000);
        this.waitForElementVisible('.page-tabs a[href="' + baseHref + '/branches"]', 1000);
        this.waitForElementVisible('.page-tabs a[href="' + baseHref + '/pr"]', 1000);
    },
    waitForRunVisible: function(runName) {
        this.waitForElementVisible('.activity-table tr#' + runName, 1000);
        this.waitForElementVisible('.activity-table tr#' + runName + ' svg.svgResultStatus', 1000);
        this.waitForElementPresent('.activity-table tr#' + runName + ' svg circle.success', 1000);
    }
}];