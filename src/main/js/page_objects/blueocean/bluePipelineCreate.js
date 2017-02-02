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
        gitCreationButton: '.scm-provider-list .git-creation',
        repositoryUrlText: '.text-repository-url input',
        newCredentialTypeSystemSSh: '.credentials-type-picker .RadioButtonGroup-item:nth-child(3)',
        createButton: '.git-step-connect .button-create-pipeline',
        openPipelineButton: '.git-step-completed .button-open-pipeline',
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
