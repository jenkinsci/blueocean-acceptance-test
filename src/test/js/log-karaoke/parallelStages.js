const jobName = 'parallelStages';
/** @module stages
 * @memberof karaoke
 * @description REGRESSION-TEST: parallel karaoke not allowing branch selection or completing correctly
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-37962|JENKINS-37962}
 *
 * TODO @see {@link https://issues.jenkins-ci.org/browse/JENKINS-37753|JENKINS-37753}
 * REGRESSION: Steps showing up as incomplete when they are in fact complete
 *
 */
module.exports = {
    /** Create Pipeline Job "parallelStages" */
    'Step 01': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline(jobName, 'parallel-stages.groovy');
    },
    /** Build Pipeline Job*/
    'Step 02': function (browser) {
        const pipelinePage = browser.page.jobUtils().forJob(jobName);
        pipelinePage.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            pipelinePage
                .waitForElementVisible('div#pipeline-box')
                .forRun(1)
                .waitForElementVisible('@executer');
        });
    },
    /** Check Job Blue Ocean Pipeline Activity Page has run  */
    'Step 03': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('parallelStages-1');
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 1);
        blueRunDetailPage.validateGraph();
        // if we have the first stage finished we can go on
        blueRunDetailPage.waitForElementPresent('@circleSuccess');
        // see whether we have focus on the first branch
        blueRunDetailPage.assertLogTitle('firstBranch');
        // give some time by waiting on 2 steps showing up
        blueRunDetailPage.validateSteps(2);
        // navigate to the secondBranch
        blueRunDetailPage.forNode(11); // -> IF groovy changes this might to be adopted
        // see whether we have focus on the second branch
        blueRunDetailPage.assertLogTitle('secondBranch');
        // we should have now 2 steps
        blueRunDetailPage.validateSteps(2);
    },
    /** Wait for job to end*/
    'Step 04': function (browser) {
        browser.waitForJobRunEnded(jobName, function () {
           // Here will test for JENKINS-37753
        });
    }
};