const tmp = require('tmp');
const async = require('async');

const repo = tmp.dirSync();
const pathToRepo = repo.name;
const jobName = 'testResults';
const path = require("path");
const sourceRep = './src/test/resources/multibranch/test_results';
const git = require("../../../main/js/api/git");

/** 
 * @module commitMessages
 * @memberof multibranch
 * @description Creates 2 commits and checks that the latest commit message is shown
 */
module.exports = {

    // ** creating a git repo */
    before: function (browser, done) {
          // we creating a git repo in target based on the src repo (see above)
          git.createRepo(sourceRep, pathToRepo).then(done);
    },
    
    // Create the multibranch job
    'Create Job': function (browser) {
        var multibranchCreate = browser.page.multibranchCreate().navigate();      
        multibranchCreate.createBranch(jobName, pathToRepo);
    },

    'Open acitivty page wait for first run to finish': function(browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName);
        // validate that we have 3 activities from the previous tests
        blueActivityPage.assertActivitiesToBeEqual(1);

        blueActivityPage.waitForRunUnstableVisible(`${jobName}-1`)
    },

    'Create new commits and check activity and branches page for correct commit messages': (client) => {
        const blueRunDetailsPage = brower.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 'master', 1);

        blueRunDetailsPage.clickTab('tests');
    },

}
