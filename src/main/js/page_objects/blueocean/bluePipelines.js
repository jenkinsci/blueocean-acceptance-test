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
module.exports.commands = [{
    assertBasicLayoutOkay: function() {
        // Seems like we could use a Nightwatch assertion for this, but then that would be global.
        // Prefer it this way, local to the page.
        
        this.waitForElementVisible('@pipelinesNav', 1000);
        this.waitForElementVisible('@newPipelineButton', 1000);
        this.waitForElementVisible('@pipelinesTable', 1000);
    }
}];