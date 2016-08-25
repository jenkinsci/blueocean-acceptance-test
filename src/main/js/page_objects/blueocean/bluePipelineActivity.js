// Blue Ocean pipelines page object (http://nightwatchjs.org/guide#page-objects)

const url = require('../../util/url');

module.exports = {
    elements: {
        pipelinesNav: '.global-header nav a[href="/blue/pipelines"]',
        emptyStateShoes: '.empty-state .empty-state-icon.shoes',
        activityTable: '.activity-table',
        activityTableEntries: 'table.activity-table tbody tr',
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    forJob: function(jobName, orgName) {
        const pageUrl = this.api.launchUrl + url.viewPipelineActivity(orgName, jobName);
        this.jobName = jobName;
        this.orgName = orgName;
        return this.navigate(pageUrl);
    },
    assertBasicLayoutOkay: function() {
        const baseHref = url.viewPipeline(this.orgName, this.jobName);
        this.waitForElementVisible('@pipelinesNav');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/activity"]');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/branches"]');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/pr"]');
    },
    waitForRunSuccessVisible: function(runName) {
        this.waitForElementVisible('.activity-table tr#' + runName);
        this.waitForElementVisible('.activity-table tr#' + runName + ' svg.svgResultStatus');
        this.waitForElementPresent('.activity-table tr#' + runName + ' svg circle.success');
    },
    waitForRunRunningVisible: function(runName) {
        this.waitForElementVisible('.activity-table tr#' + runName);
        this.waitForElementVisible('.activity-table tr#' + runName + ' svg.svgResultStatus');
        this.waitForElementPresent('.activity-table tr#' + runName + ' svg path.running');
    },
    clickTab: function (browser, tab) {
        var self = this;
        return url.clickTab(browser, self, tab);
    },
    assertActivitiesToBeEqual: function (browser, expected) {
        var self = this;
        self.waitForElementVisible('@activityTableEntries');
        browser.elements('css selector', 'table.activity-table tbody tr', function (codeCollection) {
            this.assert.equal(codeCollection.value.length, expected);
        });
    }
}];