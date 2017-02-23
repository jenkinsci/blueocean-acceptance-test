const jobName = 'loadGerman';
const newButtonSelector = '.u-flex-grow h1 a';

/** @module loadGerman
 * @memberof i18n
 * @description basic smoke test for i18n
 */
module.exports = {
    /** Load it in German */
    'Step 01': function (browser) {
        var bluePipelines = browser.page.bluePipelines().navigateLanguage("de");
        bluePipelines.waitForElementVisible(newButtonSelector);
        browser.getText(newButtonSelector, function(response) {
            browser.assert.equal(response.value, 'Übersicht');
        });        
    },

    /** Load it in The Queens English, God Bless The Queen */
    'Step 02': function (browser) {
        var bluePipelines = browser.page.bluePipelines().navigateLanguage("en");
        bluePipelines.waitForElementVisible(newButtonSelector);
        browser.getText(newButtonSelector, function(response) {
            browser.assert.equal(response.value, 'Dashboard');
        });        
    },
    
};
