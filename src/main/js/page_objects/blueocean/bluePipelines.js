// Blue Ocean pipelines page object (http://nightwatchjs.org/guide#page-objects)

var url = require('../../util/url');
var pipelinesUrl = url.viewAllPipelines();

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
        this.waitForElementVisible('@pipelinesNav', 1000);
        this.waitForElementVisible('@newPipelineButton', 1000);
        this.waitForElementVisible('@pipelinesTable', 1000);
    },
    assertJob: function(jobName) {
        this.waitForElementVisible('.pipelines-table tr[data-name="' + jobName + '"]', 1000);
    }
}];