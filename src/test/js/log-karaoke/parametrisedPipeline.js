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
const jobName2 = jobName + '1';
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
        .then(function () {
          git.createBranch('feature/1', pathToRepo)
            .then(done);
        });
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
    console.log('creating pipeline job', jobName2, 'parameterPipeline.groovy');
    // navigate to the create page
    const pipelinesCreate = browser.page.pipelineCreate().navigate();
    pipelinesCreate
      .createPipeline(jobName2, 'parameterPipeline.groovy')
    ;
  },
  /** Build Pipeline Job */
  'Step 03': function (browser) {
    // we need to create a browser page outside the async loop
    // const pipelinesCreate = browser.page.pipelineCreate().navigate();
    const pipelinePage = browser.page.jobUtils().forJob(jobName2);
    pipelinePage.buildStarted(function () {
      // Reload the job page and check that there was a build done.
      pipelinePage
        .forRun(1)
        .waitForElementVisible('@executer');
    });
    // wait for job to finish
    pipelinePage.waitForJobRunEnded(jobName2);
  },
  'Step 04': function (browser) {
    const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName2, 'jenkins');
    blueActivityPage.waitForElementVisible('a.run-button');
    blueActivityPage.click('a.run-button');
    blueActivityPage.waitForElementVisible('input[name="ShouldBuild"]');
    blueActivityPage.click('div.Checkbox-text');
    blueActivityPage.waitForElementVisible('button.inputStepSubmit');
    blueActivityPage.click('button.inputStepSubmit');
    blueActivityPage.waitForJobRunEnded(jobName2);
  },
  'Step 05': function (browser) {
    const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(jobName2, 'jenkins', 2);
    blueRunDetailPage.assertBasicLayoutOkay();
    browser.elements('css selector', 'div.result-item', function (resutlItems) {
      const results = resutlItems.value.length;
      this.assert.equal(results, 2);
      // Note, tried using "last" selectors for both CSS and XPath
      // and neither worked in nightwatch e.g. //div[starts-with(@class, 'logConsole')][last()]
      // works in the browser, but not for nightwatch.
      // NOTE: if the pipeline script (parameterPipeline.groovy) changes then the following
      // selector will need to be changed too.
      const lastLogConsoleSelector = '.logConsole.step-6';
      blueRunDetailPage.waitForElementVisible(lastLogConsoleSelector);
      blueRunDetailPage.click(lastLogConsoleSelector);
      blueRunDetailPage.waitForElementVisible('span.line');
      blueRunDetailPage.getText('span.line', function (result) {
        this.assert.equal(result.value, 'We are going to build now the branch master');
      })
    });
  }
};