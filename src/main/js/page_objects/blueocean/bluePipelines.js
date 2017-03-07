/** @module bluePipelines
 * @memberof page_objects
 * @description Represents the listing of all pipelines in blueocean
 *
 * @example
 *   var bluePipelinesPage = browser.page.bluePipelines().navigate();
 * */
const url = require('../../util/url');
const pipelinesUrl = url.viewAllPipelines();

module.exports = {

    url: function () {
        return this.api.launchUrl + pipelinesUrl;
    },
    elements: {
        pipelinesNav: '.Header-topNav nav a[href="'+pipelinesUrl+'"]',
        newPipelineButton: '.btn-new-pipeline',
        pipelinesTable: '.JTable',
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
// Seems like we could use a Nightwatch assertions for some of these, but then that would be global.
// Prefer it this way, local to the page.
module.exports.commands = [{
    /**
     * Different test on general elements that should be visible on the page
     * @returns {Object} self - nightwatch page object
     */
    assertBasicLayoutOkay: function() {
        this.waitForElementVisible('@pipelinesNav');
        this.waitForElementVisible('@newPipelineButton');
        this.waitForElementVisible('@pipelinesTable');
        this.waitForElementVisible('.Site-footer');
    },
    assertJob: function(browser, jobName) {
        //don't forget to set it back to using CSS as nightwatch is broken with its fluent/builder api. 
        //and mutates the state of browser.
        browser.useXpath().waitForElementVisible('//span[contains(text(), "' + jobName + '")]').useCss();
    },
    countJobToBeEqual: function(browser, jobName, count) {
        browser.elements('xpath', '//span[contains(text(), "' + jobName + '")]', function (codeCollection) {
            this.assert.equal(codeCollection.value.length, count);
        });
    }, 
    navigateLanguage: function(language) {
        return this.navigate(this.api.launchUrl + pipelinesUrl + '?language=' + language);
    }
}];
