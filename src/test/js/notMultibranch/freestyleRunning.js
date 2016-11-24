/** @module freestyleRunning
 * @description Check can run non multibranch
 */
module.exports = {
    /** Create freestyle Job "hijo"*/
    'Step 01': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle('hijo', 'freestyle.sh');
    },
    
    /** Build freestyle Job*/
    'Step 02': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('hijo', 'jenkins');
        blueActivityPage.waitForElementVisible('.run-button');
        
        // run the job
        blueActivityPage.click('.run-button');
        blueActivityPage.waitForElementVisible('@toastOpenButton')
        
        //check it spins and then is done  
        blueActivityPage.waitForElementVisible('#hijo-1');                
        blueActivityPage.waitForElementVisible('.progress-spinner');
        blueActivityPage.waitForElementVisible('.success');         
        blueActivityPage.waitForElementNotPresent('.progress-spinner');       
    },

};
