/** @module bluePipelineActivity
 * @memberof page_objects
 * @description Represents the listing of the activities in blueocean
 *
 * @example
 *   const blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline', 'jenkins');
 * */
const url = require('../../util/url');

module.exports = {
    elements: {
        pipelinesNav: '.global-header nav a[href="/blue/pipelines"]',
        emptyStateShoes: '.empty-state .empty-state-icon.shoes',
        activityTable: '.activity-table',
        activityTableEntries: 'table.activity-table tbody tr',
    }
};
module.exports.commands = [{
    /**
    * Returns the config page of a certain job
    * @param jobName {String} name of the job to configure
    * @param branchName {String} name of the branch (may be the same as jobname, in case of freestyle
    * @returns {Object} self - nightwatch page object
    */
    forJob: function(jobName, orgName) {
        const pageUrl = this.api.launchUrl + url.viewPipelineActivity(orgName, jobName);
        this.jobName = jobName;
        this.orgName = orgName;
        return this.navigate(pageUrl);
    },
    /**
     * Different test on general elements that should be visible on the page
     * @returns {Object} self - nightwatch page object
     */
    assertBasicLayoutOkay: function() {
        const baseHref = url.viewPipeline(this.orgName, this.jobName);
        this.waitForElementVisible('@pipelinesNav');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/activity"]');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/branches"]');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/pr"]');
    },
    /**
     * Wait for a specific run to appear in the activity table as a success
     * @param runName name of the job
     */
    waitForRunSuccessVisible: function(runName) {
        this.waitForElementVisible('.activity-table tr#' + runName);
        this.waitForElementVisible('.activity-table tr#' + runName + ' svg.svgResultStatus');
        this.waitForElementPresent('.activity-table tr#' + runName + ' svg circle.success');
    },
    /**
     * Wait for a specific run to appear in the activity table as running
     * @param runName name of the job
     * @param [callback] {Function} - callback to be invoke when finished, will pass the sse event to the callback
     */
    waitForRunRunningVisible: function(runName, callback) {
        this.waitForElementVisible('.activity-table tr#' + runName);
        this.waitForElementVisible('.activity-table tr#' + runName + ' svg.svgResultStatus');
        if (callback === undefined) {
            this.waitForElementPresent('.activity-table tr#' + runName + ' svg path.running');
        } else {
            this.waitForElementPresent('.activity-table tr#' + runName + ' svg path.running', callback);
        }
    },
    /**
    * Click css selector of a specific tab
    * @param tab {string} the tab we want to select
    * @returns {Object} self - nightwatch page object
    */
    clickTab: function (tab) {
        var self = this;
        return url.clickTab(self, tab);
    },
    /**
     * Count the activities in the table and compare them with the expected value.
     * @param expected {Number}
     */
    assertActivitiesToBeEqual: function (expected) {
        var self = this;
        const browser = this.api;
        self.waitForElementVisible('@activityTableEntries');
        browser.elements('css selector', 'table.activity-table tbody tr', function (codeCollection) {
            this.assert.equal(codeCollection.value.length, expected);
        });
    }
}];