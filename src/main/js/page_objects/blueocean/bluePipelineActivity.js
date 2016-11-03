/** @module bluePipelineActivity
 * @memberof page_objects
 * @description Represents the listing of the activities in blueocean
 *
 * @example
 *   const blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline', 'jenkins');
 * */
const url = require('../../util/url');
const pageHelper = require('../../util/pageHelper');
//oh man, I miss es6 import :(
const sanityCheck = pageHelper.sanityCheck;

module.exports = {
    elements: {
        pipelinesNav: '.global-header nav a[href="/blue/pipelines"]',
        emptyStateShoes: '.empty-state .empty-state-icon.shoes',
        activityTable: '.activity-table',
        activityTableEntries: 'table.activity-table tbody tr',
        runButton: 'a.run-button',
        toastOpenButton: {
            selector: '//div[@class="toast"]/a[@class="action" and text()="Open"]',
            locateStrategy: 'xpath',
        },
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
        if (!orgName) {
            orgName = 'jenkins';
        }
        const pageUrl = this.api.launchUrl + url.viewPipelineActivity(orgName, jobName);
        this.jobName = jobName;
        this.orgName = orgName;
        return this.navigate(pageUrl);
    },
    /**
     * Different test on general elements that should be visible on the page
     * @returns {Object} self - nightwatch page object
     */
    assertBasicLayoutOkay: function(jobName) {
        const baseHref = url.viewPipeline('jenkins', (jobName?jobName:this.jobName));
        this.waitForElementVisible('@pipelinesNav');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/activity"]');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/branches"]');
        this.waitForElementVisible('nav.page-tabs a[href="' + baseHref + '/pr"]');
        this.waitForElementVisible('.Site-footer');
        if (jobName) {
            // Test the end of the active url and make sure it's on the
            // expected activity page.
            this.assert.urlEndsWith(jobName + '/activity');
        }
    },
    /**
     * Different test on general elements that should be visible on an empty activity page
     * @returns {Object} self - nightwatch page object
     */
    assertEmptyLayoutOkay: function(jobName) {
        this.assertBasicLayoutOkay(jobName);
        this.waitForElementVisible('@emptyStateShoes');
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
     * Wait for a specific run to appear in the activity table as a failure
     * @param runName name of the job
     */
    waitForRunFailureVisible: function(runName) {
        this.waitForElementVisible('.activity-table tr#' + runName);
        this.waitForElementVisible('.activity-table tr#' + runName + ' svg.svgResultStatus');
        this.waitForElementPresent('.activity-table tr#' + runName + ' svg circle.failure');
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
    },
    /**
     * On Activity Page click the run button, then click the open in toast
     * and then validate that we are on the detail page
     * @returns {Object} self - nightwatch page object
     */
    clickRunButtonAndOpenDetail: function () {
        var self = this;
        const browser = this.api;
        // first press the runButton
        self.waitForElementVisible('@runButton');
        self.click('@runButton');
        // now press the toast "open" link
        self.waitForElementVisible('@toastOpenButton');
        self.click('@toastOpenButton', function (response) {
            sanityCheck(self, response);
        });
        return self;
    }
}];
