/** @module freestyleRunning
 * @memberof notMultibranch
 * @description Freestyle running from activity screen
 */
module.exports = {
    /** Create freestyle Job */
    'Step 01': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle('freeRun', 'freestyle.sh');
    },
    
    /** Build freestyle Job*/
    'Step 02': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('freeRun', 'jenkins');
        blueActivityPage.waitForElementVisible('.run-button');
        
        // run the job
        blueActivityPage.click('.run-button');
        blueActivityPage.waitForElementVisible('@toastOpenButton')
        
        //check it spins and then is done  
        blueActivityPage.waitForElementVisible('#freeRun-1');                
        blueActivityPage.waitForElementVisible('.progress-spinner');
        blueActivityPage.waitForElementVisible('.success');         
        blueActivityPage.waitForElementNotPresent('.progress-spinner');       
    },

};
