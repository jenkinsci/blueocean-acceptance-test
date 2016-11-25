const jobName = 'withGitFlow';
const path = require('path');
const pathToRepo = path.resolve('./target/test2-project-folder');
const soureRep = './src/test/resources/multibranch_2';
const git = require('../../../main/js/api/git');
const async = require('async');
const pageHelper = require('../../main/js/util/pageHelper');
const createCallbackWrapper = pageHelper.createCallbackWrapper;

module.exports = {

    // ** creating a git repo */
    before: function (browser, done) {
          // we creating a git repo in target based on the src repo (see above)
          git.createRepo(soureRep, pathToRepo)
              .then(function () {
                  git.createBranch('feature/1', pathToRepo)
                      .then(done);
              });
    },

  /**
   * Make sure we can open the master and the feature/1 branch results screen from activity
   * Regression: https://issues.jenkins-ci.org/browse/JENKINS-40027
   */
    'open master and feature/1 branch from activity': function (browser) {
        const cases = [{
            regexp: 'tr[id^="master"]',
            name: 'masterActivityMB',
          }, {
            regexp: 'tr[id^="feature"]',
            name: 'featureActivityMB',
          },
        ];
        async.mapSeries(cases, function (usecase, callback) {
           const jobname = usecase.name;
           const regexp = usecase.regexp;
           const multibranchCreate = browser.page.multibranchCreate().navigate();
           multibranchCreate.createBranch(jobName, pathToRepo);
           multibranchCreate.createBranch(jobname, pathToRepo);
           const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
           blueActivityPage.waitForElementVisible(regexp);
           blueActivityPage.click(regexp);
           browser.page.bluePipelineRunDetail().assertMultiBranchResult(createCallbackWrapper(callback));
        });
    },


    /**
     * Make sure we can open the master and the feature/1 branch results screen from branch
     * Regression: https://issues.jenkins-ci.org/browse/JENKINS-40027
     */
    'open master branch from branches tab': function (browser) {
        const cases = [{
            regexp: 'tr[id^="master"]',
            name: 'masterBranchesMB',
          }, {
            regexp: 'tr[id^="feature"]',
            name: 'featureBranchesMB',
          },
        ];
        async.mapSeries(cases, function (usecase, callback) {
           const jobname = usecase.name;
           const regexp = usecase.regexp;
           const multibranchCreate = browser.page.multibranchCreate().navigate();
           multibranchCreate.createBranch(jobName, pathToRepo);
           multibranchCreate.createBranch(jobname, pathToRepo);
           const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
           blueActivityPage.click(".branches");
           browser.waitForElementVisible(regexp);
           browser.click(regexp);
           browser.page.bluePipelineRunDetail().assertMultiBranchResult(createCallbackWrapper(callback));
        });
    },
};
