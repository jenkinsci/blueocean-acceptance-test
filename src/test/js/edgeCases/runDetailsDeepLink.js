/**
 * @module runDetailsDeepLink
 * @memberof edgeCases
 * @description
 *
 * Tests: test whether navigating to Run Details without specifying a tab allows the close button to work correctly.
 *
 * REGRESSION covered:
 *
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-40662|JENKINS-40662} Deep-linking to Run Details
 * screen with no tab specified causes problem when closing modal
 */
const jobName = 'runDetailsDeepLink';
module.exports = {
    /** Create Pipeline Job "runDetailsDeepLink" */
    'Step 01': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline(jobName, 'fastStages.groovy');
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
    /** Check Job Blue Ocean Pipeline Activity Page has run */
    'Step 03': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
        blueActivityPage.waitForRunSuccessVisible(jobName + '-1');
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 1);
        blueRunDetailPage.waitForElementVisible('.BasicHeader--success');
        blueRunDetailPage.closeModal('/activity');
    },
};
