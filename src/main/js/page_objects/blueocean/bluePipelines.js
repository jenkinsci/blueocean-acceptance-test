// Blue Ocean pipelines page object (http://nightwatchjs.org/guide#page-objects)

module.exports = {
    url: function () {
        return this.api.launchUrl + '/blue/pipelines';
    },
    elements: {
        pipelinesNav: '.global-header nav a[href="/blue/pipelines"]',
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
        // Would be nice if the job row/tr had something on it that allowed
        // it to be selected.
        this.waitForElementVisible('.pipelines-table td a[href="/blue/pipelines/' + jobName + '/activity"]', 1000);
    }
}];