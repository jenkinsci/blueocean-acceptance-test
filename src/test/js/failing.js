const JOB = 'noStagesFail';
/** @module failing
 * @memberof testcases
 * @description TEST: basic tests around the failing pipeline. Test whether the result is not collapsed.
 */
module.exports = {
    /**
     * Create Pipeline Job "noStagesFail", create a simple pipeline, that will produce a failure
     * @param browser
     */
    'Step 01': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        // we have used the noStages script as basis
        pipelinesCreate.createPipeline(JOB, 'noStagesFailing.groovy');
    },

    /**
     * Build Pipeline Job
     * @param browser
     */
    'Step 02': function (browser) {
        const pipelinePage = browser.page.jobUtils().forJob('noStagesFail');
        // start to build the pipeline
        pipelinePage.buildStarted(function() {
            // Reload the job page and check that there is a build started.
            pipelinePage
                .waitForElementVisible('div#pipeline-box')
                .forRun(1)
                .waitForElementVisible('@executer');
        });
    },
    /**
     * Check whether the resultItemas are collapsing as expected.
     * @param browser
     */
    // now testing JENKINS-37666
    'Step 03': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(JOB, 'jenkins', 1);
        // we want to analyse the result after the job has finished
        browser.waitForJobRunEnded(JOB, function() {
            // the failure should collapse
            blueRunDetailPage.clickFirstResultItemFailure(false);
            // test whether the expand works
            blueRunDetailPage.clickFirstResultItem();
            // now click again so the result collapse again
            blueRunDetailPage.clickFirstResultItem(false);
            // now click the node again and see whether only one code is visible
            blueRunDetailPage.clickFirstResultItem();
            // we now need to get all visible code blocks, but there should be no more then one
            browser.elements('css selector', 'code', function (codeCollection) {
                this.assert.equal(typeof codeCollection, "object");
                this.assert.equal(codeCollection.status, 0);
                // JENKINS-36700 in fail all code should be closed besides one
                // however if the browser is too quick there can still be two open
                this.assert.equal(codeCollection.value.length <= 2, true);
            });

        });
    }
};
