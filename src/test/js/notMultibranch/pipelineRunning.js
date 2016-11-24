/** @module pipelineRunning
 * @memberof notMultibranch
 * @description Check can run non multibranch pipelines from activity
 */
module.exports = {
    /** Create pipeline Job */
    'Step 01': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        // we have used the noStages script as basis
        pipelinesCreate.createPipeline("pipeRun", 'no-stages.groovy');
    },

    
    /** Build pipeline Job*/
    'Step 02': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('pipeRun', 'jenkins');
        blueActivityPage.waitForElementVisible('.run-button');
        
        // run the job
        blueActivityPage.click('.run-button');
        blueActivityPage.waitForElementVisible('@toastOpenButton')
        
        //check it spins and then is done  
        blueActivityPage.waitForElementVisible('#pipeRun-1');                
        blueActivityPage.waitForElementVisible('.progress-spinner');
        blueActivityPage.waitForElementVisible('.success');         
        blueActivityPage.waitForElementNotPresent('.progress-spinner');       
    },

};
