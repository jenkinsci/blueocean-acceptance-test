/** @module parametrisedPipeline
 * @memberof log-karaoke
 * @description
 *
 * Tests: covering basic parameters in runButton
 *
 */
const git = require("../../../main/js/api/git");
const path = require("path");

const jobName = 'parameter';
// git repo details
const pathToRepo = path.resolve('./target/test-project-parameter');
const soureRep = './src/test/resources/parametrised';

module.exports = {
  /**
   * creating a git repo
   */
  before: function (browser, done) {
      // we creating a git repo in target based on the src repo (see above)
      git.createRepo(soureRep, pathToRepo)
        .then(done);
  },

  'step 01': function (browser) {
    // Initial folder create page
    const multibranchCreate = browser.page.multibranchCreate().navigate();
    multibranchCreate.createBranch(jobName, pathToRepo);
    const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
    blueActivityPage.click('.branches');
    blueActivityPage.waitForElementVisible('tr[id^="master"]');
    blueActivityPage.waitForElementVisible('a.run-button');
    blueActivityPage.click('a.run-button');
    blueActivityPage.waitForElementVisible('button.inputStepSubmit');
    blueActivityPage.click('button.inputStepSubmit');
  },
  /** Create Pipeline Job "stages" */
  'Step 02': function (browser) {
    // create the different jobs
    console.log('creating pipeline job', jobName + '1', 'parameterPipeline.groovy');
    // navigate to the create page
    const pipelinesCreate = browser.page.pipelineCreate().navigate();
    pipelinesCreate
      .createPipeline(jobName + '1', 'parameterPipeline.groovy')
    ;
  },
  /** Build Pipeline Job */
  'Step 03': function (browser) {
    // we need to create a browser page outside the async loop
    // const pipelinesCreate = browser.page.pipelineCreate().navigate();
    const pipelinePage = browser.page.jobUtils().forJob(jobName + '1');
    pipelinePage.buildStarted(function() {
      // Reload the job page and check that there was a build done.
      pipelinePage
        .waitForElementVisible('div#pipeline-box')
        .forRun(1)
        .waitForElementVisible('@executer');
    });
    // wait for job to finish
    pipelinePage.waitForJobRunEnded(jobName + '1');
  },
  'Step 04': function (browser) {
    const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName + '1', 'jenkins');
    blueActivityPage.waitForElementVisible('a.run-button');
    blueActivityPage.click('a.run-button');
    blueActivityPage.waitForElementVisible('button.inputStepSubmit');
    blueActivityPage.click('button.inputStepSubmit');
  }
};