const jobName = 'loadGerman';
/** @module loadGerman
 * @memberof i18n
 * @description basic smoke test for i18n
 */
module.exports = {
    /** Load it in German */
    'Step 01': function (browser) {
        var bluePipelines = browser.page.bluePipelines().navigateLanguage("de");
        bluePipelines.waitForElementVisible('.btn-secondary.inverse');
        browser.getText('.btn-secondary.inverse', function(response) {            
            browser.assert.equal(response.value, 'Neue Pipeline');
        });        
    },

    /** Load it in The Queens English, God Bless The Queen */
    'Step 01': function (browser) {
        var bluePipelines = browser.page.bluePipelines().navigateLanguage("en");
        bluePipelines.waitForElementVisible('.btn-secondary.inverse');
        browser.getText('.btn-secondary.inverse', function(response) {            
            browser.assert.equal(response.value, 'New Pipeline');
        });        
    },
    
};
