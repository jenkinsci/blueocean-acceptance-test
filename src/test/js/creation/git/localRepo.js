/**
 * @module localRepo
 * @memberof git
 * @description
 *
 * Tests: test when creating a pipeline from a local Git repo works
 */
const git = require("../../../../main/js/api/git");
const path = require("path");

const jobName = 'test-project-folder';
const pathToRepo = path.resolve('./target/' + jobName);
const sourceRep = './src/test/resources/multibranch_2';


module.exports = {
    before: function(browser, done) {
        browser.waitForJobDeleted(jobName, function () {
            // we creating a git repo in target based on the src repo (see above)
            git.createRepo(sourceRep, pathToRepo)
                .then(function () {
                    git.createBranch('feature/alpha', pathToRepo)
                        .then(done);
                });
        });
    },

    'Step 01 - Create Pipeline': function (browser) {
        const pipelineCreate = browser.page.bluePipelineCreate().navigate();
        // TOOD: migrate to page object
        pipelineCreate.waitForElementVisible('.scm-provider-list');
        pipelineCreate.click('.scm-provider-list button:first-child');
        pipelineCreate.waitForElementVisible('.git-step-connect');
        pipelineCreate.setValue('.text-repository-url input', pathToRepo);
        pipelineCreate.click('.credentials-type-picker .RadioButtonGroup-item:nth-child(3)');
        pipelineCreate.click('@createButton');
        pipelineCreate.assertCompleted();
    },
    'Step 02 - Check Activity Tab': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
        blueActivityPage.assertBasicLayoutOkay();
        // TODO: more asserts on running jobs
        // browser.pause(15000);
    }
};
