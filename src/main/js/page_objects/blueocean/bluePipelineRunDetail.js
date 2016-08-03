// Blue Ocean pipeline run detail page object (http://nightwatchjs.org/guide#page-objects)

var url = require('../../util/url');

module.exports = {
    elements: {
        logHeader: '.dialog .log-header',
        fullLog: 'div.fullLog a',
        followAlongOn: '.step-scroll-area.follow-along-on',
        followAlongOff: '.step-scroll-area.follow-along-off'
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
    clickFullLog: function (browser) {
        var self = this;
        self.waitForElementVisible('@fullLog');
        self.click('@fullLog')
        browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                // is the "full log" link gone?
                self.fullLogButtonNotPresent();
                // did we changed the url on  change?
                self.assert.equal(response.value.includes('start=0'), true);
                return self;
            })
    },
    fullLogButtonNotPresent: function () {
        // is the "full log" link gone?
        this.expect.element('@fullLog').to.not.be.present.before(1000);
        return this;
    }
}];