// Blue Ocean pipeline run detail page object (http://nightwatchjs.org/guide#page-objects)

var url = require('../../util/url');

module.exports = {
    elements: {
        code: 'code',
        progressBar: 'div.loadingContainer',
        logHeader: '.dialog .log-header',
        fullLog: 'div.fullLog a',
        followAlongOn: '.step-scroll-area.follow-along-on',
        followAlongOff: '.step-scroll-area.follow-along-off',
        emptystate: 'div.empty-state',
        detailTitle: 'section.table',
        closeButton: 'a.closeButton',
        activityTable: '.activity-table',
        highlightedGraph: 'g.pipeline-selection-highlight',
        steps: 'div.logConsole',
        artifactTable: 'table.artifacts-table',
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
    forNode: function(id) {
        const baseUrl = this.pageUrl();
        return this.navigate(baseUrl + '/pipeline/' + id);
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
    },
    assertTitle: function (expected) {
        var self = this;
        self.waitForElementVisible('@detailTitle');
        self.getText('@detailTitle', function (response) {
            self.assert.equal(typeof response, "object");
            self.assert.equal(response.status, 0);
            const urlProect = (response.value);
            self.assert.equal(urlProect.indexOf(expected)>-1, true);
            return self;
        })

    },
    closeModal: function (browser) {
        var self = this;
        self.waitForElementVisible('@closeButton');
        self.click('@closeButton');
        browser.url(function (response) {
            self.assert.equal(typeof response, "object");
            self.assert.equal(response.status, 0);
            this.pause(10000)
            // FIXME JENKINS-36619 -> somehow the close in AT is not working as it should
            // I debugged a bit and found out that the "previous" location is the same as
            // current, this is the reason, why no url change is triggered. The question remains
            // why that is happening
            return self;
        })
    },
    clickTab: function(browser, tab) {
        var self = this;
        const tabSelector = this.tabSelector(tab);
        self.waitForElementVisible(tabSelector);
        self.click(tabSelector);
        browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                // did we changed the url on  change?
                self.assert.equal(response.value.includes(tab), true);
                return self;
            })
    },
    clickFullLog: function (browser) {
        var self = this;
        self.waitForElementVisible('@fullLog');
        self.click('@fullLog')
        browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                // is the "full log" link gone?
                self.fullLogButtonNotPresent();
                // is the progressbar visible and not the code?
                self.validateLoading();
                // did we changed the url on  change?
                self.assert.equal(response.value.includes('start=0'), true);
                return self;
            })
    },
    fullLogButtonNotPresent: function () {
        // is the "full log" link gone?
        this.expect.element('@fullLog').to.not.be.present.before(1000);
        return this;
    },
    validateLoading: function () {
        var self = this;
        // when we are loading
        // the progressBar should be present
        self.waitForElementVisible('@progressBar');
        // when we are loading the code element should not be present
        this.expect.element('@code').to.not.be.present.before(1000);

    },
    validateGraph: function () {
        var self = this;
        self.waitForElementVisible('@highlightedGraph');
        return self;
    },
    validateSteps: function (browser) {
        var self = this;
        self.waitForElementVisible('@steps');
        browser.elements('css selector', '.logConsole', function (codeCollection) {
            this.assert.equal(codeCollection.value.length > 0, true);
        });
    },
    validateEmpty: function () {
        var self = this;
        self.waitForElementVisible('@emptystate');
        return self;
    },
    validateNotEmpty: function () {
        var self = this;
        self.waitForElementVisible('@artifactTable');
        return self;
    }
}];