const jobName = 'noRunsActivityPage';
const tmp = require('tmp');

const repo = tmp.dirSync();
const pathToRepo = repo.name;
const path = require("path");
const sourceRep = './src/test/resources/multibranch/test_results';
const git = require("../../../main/js/api/git");


/** @module failing
 * @memberof testcases
 * @description TEST: basic tests around the failing pipeline. Test whether the result is not collapsed.
 */
module.exports = {
    // ** creating a git repo */
    before: (browser, done) => {
          // we creating a git repo in target based on the src repo (see above)
          git.createRepo(sourceRep, pathToRepo).then(done);
    },
    /**
     * Create Multibranch Pipeline Job "noRunsActivityPage" with no branches.
     * @param browser
     */
    'Create job': (browser) => {
        var multibranchCreate = browser.page.multibranchCreate().navigate();
      
        multibranchCreate.createBranch(jobName, pathToRepo);
    },

    'Delete runs': (browser) => {
        browser.useXpath()
            // Navidate back to main job screen
            .waitForElementVisibleThenClick('//*[@id="breadcrumbs"]/li[3]/a')
            // Navigate to master branch.
            .waitForElementVisibleThenClick('//*[@id="job_master"]/td[3]/a')
            // Wait until run is done. TODO make this better.
            .pause(5000)
            .refresh()
            // Click on run 1
            .waitForElementVisibleThenClick('//*[@id="buildHistory"]/div[2]/table/tbody/tr[2]/td/div[1]/a')
            // Click delete
            .waitForElementVisibleThenClick('//a[@href="/job/noRunsActivityPage/job/master/1/confirmDelete"]')
            // Click confirm.
            .waitForElementVisibleThenClick('//*[@id="yui-gen1-button"]');
    },
    /**
     * Make sure that we show the empty state.
     */
    'Check empty states': (browser) => {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');

        blueActivityPage.waitForElementVisible('@emptyStateShoes');
        
        //Make sure branch shows branch.
        browser.useXpath()
            // for some reacon clickTab isnt working, doing it with xpath instead =/
            .click('//a[@class="branches"]')
            .waitForElementVisible('//td[text()="master"]')
    }
}