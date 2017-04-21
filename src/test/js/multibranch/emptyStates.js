const jobName = 'emptyStates';
/** @module emptyStates
 * @memberof multibranch
 * @description Check empty states for multibranch jobs
 */
module.exports = {

    'Step 01: Create job': (browser) => {
         var multibranchCreate = browser.page.multibranchCreate().navigate();      
         multibranchCreate.createBranch(jobName);   
    },
    
    'Step 02: Check emptyStates': (browser) => {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
        
        blueActivityPage.waitForElementVisible('@emptyStateShoes');

        blueActivityPage.clickTab('branches');
     
        blueActivityPage.assert.containsText('.empty-state-content', 'Branch out');       

        blueActivityPage.clickTab('pr');
     
        blueActivityPage.assert.containsText('.empty-state-content', 'Push me');       
  
    }
}
