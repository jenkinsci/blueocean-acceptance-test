// Blue Ocean pipelines page object (http://nightwatchjs.org/guide#page-objects)

const url = require('../../util/url');
const pipelinesUrl = url.viewAllPipelines();

module.exports = {

    url: function () {
        return this.api.launchUrl + pipelinesUrl;
    },
    elements: {
        pipelinesNav: '.global-header nav a[href="'+pipelinesUrl+'"]',
        newPipelineButton: '.page-title a[href="/view/All/newJob"]',
        pipelinesTable: '.pipelines-table',
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
// Seems like we could use a Nightwatch assertions for some of these, but then that would be global.
// Prefer it this way, local to the page.
module.exports.commands = [{
    assertBasicLayoutOkay: function() {
        this.waitForElementVisible('@pipelinesNav');
        this.waitForElementVisible('@newPipelineButton');
        this.waitForElementVisible('@pipelinesTable');
    },
    assertJob: function(jobName) {
        this.waitForElementVisible('.pipelines-table tr[data-name="' + jobName + '"]');
    },
    countJobToBeEqual: function(browser, jobName, count) {
        browser.elements('css selector', '.pipelines-table tr[data-name="' + jobName + '"]', function (codeCollection) {
            this.assert.equal(codeCollection.value.length, count);
        });
    }
}];