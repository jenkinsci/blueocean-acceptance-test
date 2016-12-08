const jobName = 'pipeRunArtifacts';
/** 
 * @module artifacts
 * @memberof artifacts
 * @description Makes sure artifacts show correctly.
 */
module.exports = {
    /** Create pipeline Job */
    'Step 01': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
    
        pipelinesCreate.createPipeline(jobName, 'lots-of-artifacts.groovy');
    },

     /** Build Pipeline Job*/
    'Step 02': function (browser) {
        const pipelinePage = browser.page.jobUtils().forJob(jobName);
        pipelinePage.buildStarted(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage
                .waitForElementVisible('div#pipeline-box')
                .forRun(1)
                .waitForElementVisible('@executer');
        });
    },

    'Step 03': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
       
       blueActivityPage.waitForRunSuccessVisible(`${jobName}-1`);

        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 1);
        
        blueRunDetailPage.waitForElementVisible('div.header.success');
        
        blueRunDetailPage.clickTab('artifacts');

        browser.assert.containsText('.artifactListingLimited', 'Only showing the first 100 artifacts');
    }

};
