const url = require('../../util/url');
const pageHelper = require('../../util/pageHelper');
//oh man, I miss es6 import :(
const sanityCheck = pageHelper.sanityCheck;
const isCodeBlockVisibleCallback = pageHelper.isCodeBlockVisibleCallback;
const notEmptyHelper = pageHelper.notEmptyHelper;
/** @module bluePipelineRunDetails
 * @memberof page_objects
 * @description Represents the detail page of a job in blueocean
 *
 * @example
 *   const blueRunDetailPage = browser.page.bluePipelineRunDetail()
 .forRun(jobNameFreestyle, 'jenkins', 1);
 * */
module.exports = {
    // selectors
    elements: {
        code: 'code',
        progressBar: 'div.loadingContainer',
        logHeader: '.dialog .log-header',
        fullLog: 'div.fullLog a',
        followAlongOn: '.step-scroll-area.follow-along-on',
        followAlongOff: '.step-scroll-area.follow-along-off',
        emptystate: 'div.empty-state',
        emptystateQueued: 'div.empty-state span.waiting',
        detailTitle: 'section.table',
        closeButton: 'a.closeButton',
        activityTable: '.activity-table',
        highlightedGraph: 'g.pipeline-selection-highlight',
        logConsole: 'div.logConsole',
        artifactTable: 'table.artifacts-table tr',
        changes: 'table.changeset-table tr',
        tests: 'div.new-failure-block div.result-item',
        authors: 'a.authors',
        circleSuccess: 'svg circle.success',
        firstResult: {
            selector: '//div[contains(@class, "result-item") and position()=1]',
            locateStrategy: 'xpath',
        },
        firstErrorResult: {
            selector: '//div[contains(@class, "failure") and position()=1]',
            locateStrategy: 'xpath',
        },
    }
};

module.exports.commands = [{
    /**
     * Navigate to a certain detail page, calculated based on diferent params
     *
     * @example
     *   const blueRunDetailPage = browser.page.bluePipelineRunDetail()
     .forRun(jobNameFreestyle, 'jenkins', 1);
     *
     * @param {String} jobName
     * @param {String} orgName
     * @param {String|Number} branchName - either the branchName o the buildNumber
     * @param {Number} [buildNumber]
     * @returns {Object} self - nightwatch page object
     */
    forRun: function (jobName, orgName, branchName, buildNumber) {
        this.jobName = jobName;
        this.orgName = orgName;
        this.multiBranchJob = (typeof branchName === 'string' ? branchName : jobName);
        this.buildNumber = (typeof branchName === 'number' ? branchName : buildNumber);
        return this.navigate(this.pageUrl());
    },
    /**
     * Will return either a relative or an absolute URL
     * @param {Boolean} relative
     * @returns {String} url
     */
    pageUrl: function(relative) {
        var runUrl =  url.makeRelative(url.viewRunPipeline(this.orgName, this.jobName, this.multiBranchJob, this.buildNumber));

        return !relative ?
        this.api.launchUrl + runUrl :
            runUrl;
    },
    /**
     * Navigate to a certain node of a detail page of a certain pipeline graph,
     * @param {String} id - node id
     * @returns {Object} self - nightwatch page object
     */
    forNode: function (id) {
        const baseUrl = this.pageUrl();
        return this.navigate(baseUrl + '/pipeline/' + id);
    },
    /**
     * Navigate to a certain tab by going directly to the url
     * @param {String} tabName
     * @returns {Object} self - nightwatch page object
     */
    tabUrl: function (tabName, relative) {
        return this.pageUrl(relative) + '/' + tabName;
    },
    /**
     * Different test on general elements that should be visible on the page
     * @returns {Object} self - nightwatch page object
     */
    assertBasicLayoutOkay: function() {
        this.waitForElementVisible(url.tabSelector('pipeline'));
        this.waitForElementVisible(url.tabSelector('changes'));
        this.waitForElementVisible(url.tabSelector('tests'));
        this.waitForElementVisible(url.tabSelector('artifacts'));
        this.waitForElementVisible('@logHeader');
        // TODO: add class info to the page content so we can test it
        // Atm there's very little on the page that will allow us to test it.
        // E.g. nothing on the pipeline graph that allows us to find it.
        return this;
    },
    /**
     * Validate that the detail title contains the expected value
     * @param {String} expected - the title we await
     * @returns {Object} self - nightwatch page object
     */
    assertTitle: function (expected) {
        const self = this;
        self.waitForElementVisible('@detailTitle');
        self.getText('@detailTitle', function (response) {
            sanityCheck(self, response);
            const urlProject = (response.value);
            self.assert.equal(urlProject.indexOf(expected) > -1, true);
        });
        return self;
    },
    /**
     * Validate that the log title contains the expected value
     * @param {String} expected - the title we await
     * @returns {Object} self - nightwatch page object
     */
    assertLogTitle: function (expected) {
        const self = this;
        self.waitForElementVisible('@logHeader');
        self.getText('@logHeader', function (response) {
            sanityCheck(self, response);
            console.log(response)
            const urlProject = (response.value);
            self.assert.equal(urlProject.indexOf(expected) > -1, true);
        });
        return self;
    },
   /**
     * Close the modal view
     * @returns {Object} self - nightwatch page object
     */
    closeModal: function () {
        const self = this;
        const browser = self.api;
        self.waitForElementVisible('@closeButton');
        self.click('@closeButton');
        browser.url(function (response) {
            sanityCheck(self, response);
            // FIXME JENKINS-36619 -> somehow the close in AT is not working as it should
            // I debugged a bit and found out that the "previous" location is the same as
            // current, this is the reason, why no url change is triggered. The question remains
            // why that is happening
            // this.pause(10000)
        })
        return self;
    },
    /**
     * Navigate to a certain tab by clicking on it
     * @param {String} tab - tabName
     * @returns {Object} self - nightwatch page object
     */
    clickTab: function (tab) {
        const self = this;
        const browser = self.api;
        // leverage to url helper
        return url.clickTab(self, tab);
    },
    /**
     * Click the "Full Log" button and validate that we have changed the url
     * @param {String} tab - tabName
     * @returns {Object} self - nightwatch page object
     */
    clickFullLog: function () {
        const self = this;
        const browser = self.api;
        self.waitForElementVisible('@fullLog');
        self.click('@fullLog', function (response) {
            // sanity test
            sanityCheck(self, response);
            // validate that we have changed the url
            browser.url(function (responseInner) {
                sanityCheck(self, responseInner);
                // is the "full log" link gone?
                self.fullLogButtonNotPresent();
                // is the progressbar visible and not the code?
                self.validateLoading();
                // did we changed the url on  change?
                self.assert.equal(responseInner.value.includes('start=0'), true);
            })
        })
        return self;

    },
    /**
     * validate that the button for the full log is not present
     * @returns {Object} self - nightwatch page object
     */
    fullLogButtonNotPresent: function () {
        // is the "full log" link gone?
        this.expect.element('@fullLog').to.not.be.present.before(1000);
        return this;
    },
    /**
     * validate that show the progressBar to indicate loading
     * @returns {Object} self - nightwatch page object
     */
    validateLoading: function () {
        const self = this;
        // when we are loading
        // the progressBar should be present
        self.waitForElementVisible('@progressBar');
        // when we are loading the code element should not be present
        this.expect.element('@code').to.not.be.present.before(1000);
        return self;

    },
    /**
     * validate that the pipeline graph is present
     * @returns {Object} self - nightwatch page object
     */
    validateGraph: function () {
        const self = this;
        self.waitForElementVisible('@highlightedGraph');
        return self;
    },
    /**
     * validate that we have some steps to show
     * @returns {Object} self - nightwatch page object
     */
    validateSteps: function (expectedMinimum) {
        const self = this;
        self.waitForElementVisible('@logConsole');
        const selector = '.logConsole';
        return notEmptyHelper(selector, self, expectedMinimum);
    },
    /**
     * validate that the log console is present
     * @returns {Object} self - nightwatch page object
     */
    validateLog: function () {
        const self = this;
        self.waitForElementVisible('@code');
        return self;
    },
    /**
     * validate that the emptyState box is present
     * @returns {Object} self - nightwatch page object
     */
    validateEmpty: function () {
        const self = this;
        self.waitForElementVisible('@emptystate');
        return self;
    },
    /**
     * validate that the emptyState box contains a span which indicates queued state
     * @returns {Object} self - nightwatch page object
     */
    validateQueued: function () {
        const self = this;
        self.waitForElementVisible('@emptystateQueued');
        return self;
    },
    /**
     * validate that the artifact table has entries
     * @param {Number} [expectedMinimum]
     * @returns {Object} self - nightwatch page object
     */
    validateNotEmptyArtifacts: function (expectedMinimum) {
        const self = this;
        self.waitForElementVisible('@artifactTable');
        const selector = 'table.artifacts-table tr';
        return notEmptyHelper(selector, self, expectedMinimum ? expectedMinimum + 1 : 1);  // +1 because of the heading row
    },
     /**
     * validate that the changes table has entries
     * @param {Number} [expectedMinimum]
     * @returns {Object} self - nightwatch page object
     */
    validateNotEmptyChanges: function (expectedMinimum) {
        const self = this;
        self.waitForElementVisible('@changes');
        const selector = 'table.changeset-table tr';
        return notEmptyHelper(selector, self, expectedMinimum ? expectedMinimum + 1 : 1);  // +1 because of the heading row
    },
    /**
     * validate that the we have failing tests
     * @param {Number} [expectedMinimum]
     * @returns {Object} self - nightwatch page object
     */
    validateFailingTests: function (expectedMinimum) {
        const self = this;
        self.waitForElementVisible('@tests');
        const selector = 'div.new-failure-block div.result-item';
        return notEmptyHelper(selector, self, expectedMinimum);
    },
    /**
     * validate that the authors in the modal header are condensed
     * @returns {Object} self - nightwatch page object
     */
    authorsIsCondensed: function () {
        const self = this;
        self.waitForElementVisible('@authors');
        self.getText('@authors', function (response) {
            sanityCheck(self, response);
            const hint = (response.value);
            // 'Changes by' only appears in not condensed state
            self.assert.equal(hint.indexOf('Changes by') > -1, false);
        });
        return self;
    },
    /**
     * validate that the authors in the modal header are not condensed
     * @returns {Object} self - nightwatch page object
     */
    authorsIsNotCondensed: function (browser) {
        const self = this;
        self.waitForElementVisible('@authors');
        self.getText('@authors', function (response) {
            sanityCheck(self, response);
            const hint = (response.value);
            // 'Changes by' only appears in not condensed state
            self.assert.equal(hint.indexOf('Changes by') > -1, true);
        });
        return self;
    },
    /**
     * validate that the authors are not set - in case of no scm changes
     * @returns {Object} self - nightwatch page object
     */
    authorsIsNotSet: function (browser) {
        const self = this;
        self.expect.element('@authors').to.not.be.present.before(1000);
        return self;
    },
    /**
     * Locate and click the first result item
     * @param {boolean} expand - if undefined or true we will assert whether an expand has happened
     * @returns {Object} self - nightwatch page object
     */
    clickFirstResultItem: function (expand) {
        const self = this;
        self
            .waitForElementVisible('@firstResult')
            .click('@firstResult', isCodeBlockVisibleCallback(self, expand));

        return self;
    },
    /**
     * Locate and click the first result item that has failed
     * @param {boolean} expand - if undefined or true we will assert whether an expand has happened
     * @returns {Object} self - nightwatch page object
     */
    clickFirstResultItemFailure: function (expand) {
        const self = this;
        self
            .waitForElementVisible('@firstErrorResult')
            .click('@firstErrorResult', isCodeBlockVisibleCallback(self, expand));
        // to make component chain-able we will return self - part 2
        return self;
    },
    /**
     * test whether the content container has scrolled to the bottom - using scrollHeight
     * @returns {Object} self - nightwatch page object
     */
    validateScrollToBottom: function () {
        // to make component chain-able we will return self - part 1
        const self = this;
        const browser = this.api;
        browser.execute(function (selector) {
            const cmElem = document.evaluate(
                selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            // return the scrollHeight to determine whether we moved to the bottom on karaoke
            return cmElem.scrollHeight;
        }, ['//div[@class="content"]'], function (result) {
            // sanity checks
            sanityCheck(self, result);
            // the scrollHeight has to be higher 0 to indicate that we have scrolled
            browser.assert.equal(result.value > 0, true);
            // to make component chain-able we will return self - part 2
        });
        return self;
    }

}];
