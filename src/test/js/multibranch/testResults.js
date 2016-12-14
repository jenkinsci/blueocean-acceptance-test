const tmp = require('tmp');

const repo = tmp.dirSync();
const pathToRepo = repo.name;
const jobName = 'testResults';
const path = require("path");
const sourceRep = './src/test/resources/multibranch/test_results';
const git = require("../../../main/js/api/git");

/** 
 * @module testResults
 * @memberof multibranch
 * @description Tests the tests tab
 */
module.exports = {

    // ** creating a git repo */
    before: (browser, done) => {
          // we creating a git repo in target based on the src repo (see above)
          git.createRepo(sourceRep, pathToRepo).then(done);
    },
    
    // Create the multibranch job
    'Create Job': (browser) => {
        var multibranchCreate = browser.page.multibranchCreate().navigate();      
        multibranchCreate.createBranch(jobName, pathToRepo);
    },

    'Open acitivty page wait for first run to finish': (browser) => {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName);
        // validate that we have 3 activities from the previous tests
        blueActivityPage.assertActivitiesToBeEqual(1);

        blueActivityPage.waitForRunUnstableVisible(`${jobName}-1`)
    },

    'Check that the tests tab displays correctly': (browser) => {
        const blueRunDetailsPage = browser.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 'master', 1);

        blueRunDetailsPage.clickTab('tests');

        // Expand the test.
        browser.useXpath().click('//div[@class="result-item-head"]');

        browser.useXpath().waitForElementVisible('//div[@class="test-console"]/h4')
    },
}
