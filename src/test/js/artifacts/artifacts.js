const jobName = 'pipeRunArtifacts';
/** @module pipelineRunning
 * @memberof notMultibranch
 * @description Check can run non multibranch pipelines from activity
 */
module.exports = {
    /** Create pipeline Job */
    'Step 01': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        // we have used the noStages script as basis
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

     /** Check Job Blue Ocean Pipeline Activity Page has run  - stop follow
     * need to click on an element so the up_arrow takes place in the window
     * */
    'Step 03': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunSuccessVisible(`${jobName}-1`);

        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 1);
        
        blueRunDetailPage.waitForElementVisible('div.header.success');
        
        blueRunDetailPage.clickTab('artifacts');

        browser.assert.containsText('.artifactListingLimited', 'Only showing the first 100 artifacts');
    }

};
