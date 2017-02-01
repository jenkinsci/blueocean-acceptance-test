/**
 * @module blueCreate
 * @memberof page_objects
 * @description Represents the "create piepline" page
 *
 * @example
 *   var blueCreatePage = browser.page.blueCreate().navigate();
 * */
const url = require('../../util/url');

module.exports = {
    url: function() {
        return this.api.launchUrl + url.createPipeline();
    },
    elements: {
        createButton: {
            selector: '//button[contains(text(), "Create Pipeline")]',
            locateStrategy: 'xpath',
        },
        openPipelineButton: {
            selector: '.last-step.complete button'
        },
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
// Seems like we could use a Nightwatch assertions for some of these, but then that would be global.
// Prefer it this way, local to the page.
module.exports.commands = [{
    assertCompleted: function() {
        this.waitForElementVisible('.last-step.complete');
        this.waitForElementVisible('@openPipelineButton');
    }
}];
