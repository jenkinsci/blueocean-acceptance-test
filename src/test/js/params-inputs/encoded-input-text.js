/** @module encoded-input-text
 * @memberof params-inputs
 * @description
 *
 * Tests: covering encoding of message, name, description text on input controls used on Job params and input step.
 *
 * See https://issues.jenkins-ci.org/browse/JENKINS-41162
 *
 */
const jobName = 'parameterPipeline-html-in-descriptions';

module.exports = {
    'Step 01: create job': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline(jobName, 'parameterPipeline-html-in-descriptions.groovy');
    },
    'Step 02: start job run': function (browser) {
        // we need to create a browser page outside the async loop
        // const pipelinesCreate = browser.page.pipelineCreate().navigate();
        const pipelinePage = browser.page.jobUtils().forJob(jobName);
        pipelinePage.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            pipelinePage
                .waitForElementVisible('div#pipeline-box')
                .forRun(1)
                .waitForElementVisible('@executer');
        });
    },
    'Step 03: check the run input form for html tags (JENKINS-41162)': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName);

        blueActivityPage.waitForElementVisible('@activityTableEntries');

        // Click the first in the list and wait for the
        // "Proceed" button to appear.
        blueActivityPage.click('@activityTableEntries');
        blueActivityPage.waitForElementVisible('@inputStepSubmit');

        // Check that the text was stripped of markup.
        // See parameterPipeline-html-in-descriptions.groovy and how the labels
        // and descriptions were defined with embedded <b> tags.
        // See https://issues.jenkins-ci.org/browse/JENKINS-41162
        blueActivityPage.assert.containsText('@inputStepContainer', 'Some inputs');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My text.');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My choice.');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My flag.');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My password.');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My text description.');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My choice description.');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My flag description.');
        blueActivityPage.assert.containsText('@inputStepContainer', 'My password description.');

        // Press submit on the form, allowing the build to finish out.
        blueActivityPage.click('@inputStepSubmit');
        blueActivityPage.waitForJobRunEnded(jobName);
    }
};