/** @module multibranchOpening
 * @memberof multibranch
 * @description TEST: basic tests around multiBranch and encoding of branches
 */
const async = require('async');
const path = require('path');
const pathToRepo = path.resolve('./target/test2-project-folder');
const sourceRep = './src/test/resources/multibranch_2';
const git = require('../../../main/js/api/git');
const pageHelper = require('../../../main/js/util/pageHelper');
const createCallbackWrapper = pageHelper.createCallbackWrapper;

module.exports = {
  // ** creating a git repo */
  before: function (browser, done) {
    // we creating a git repo in target based on the src repo (see above)
    git.createRepo(sourceRep, pathToRepo)
      .then(function () {
        git.createBranch('feature/1', pathToRepo)
          .then(done);
      });
  },
  /**
   * Make sure we can open the master and the feature/1 branch results screen from activity and branch tab
   * Regression: https://issues.jenkins-ci.org/browse/JENKINS-40027
   */
  'open master and feature/1 branch from activity and from branch tab': function (browser) {
    const cases = [{
        regexp: 'tr[id^="master"]',
        name: 'masterActivityMB',
      }, {
        regexp: 'tr[id^="feature"]',
        name: 'featureActivityMB',
      },
      {
        regexp: 'tr[id^="master"]',
        name: 'masterBranchesMB',
        branch: true,
      }, {
        regexp: 'tr[id^="feature"]',
        name: 'featureBranchesMB',
        branch: true,
      },
    ];
    async.mapSeries(cases, function (usecase, callback) {
      const jobName = usecase.name;
      const regexp = usecase.regexp;
      const branch = usecase.branch;
      console.log('creating job', jobName);
      const multiBranchCreate = browser.page.multibranchCreate().navigate();
      multiBranchCreate.createBranch(jobName, pathToRepo);
      const blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
      console.log('clicking from' , branch ? 'branches' : 'activities', 'tab');
      function detailCheck() {
        blueActivityPage.waitForElementVisible(regexp);
        blueActivityPage.click(regexp, function () {
          browser.page.bluePipelineRunDetail().assertMultiBranchResult(createCallbackWrapper(callback));
        });
      }
      if (branch) {
        blueActivityPage.click(".branches", detailCheck);
      } else {
        detailCheck();
      }
    });
  },
};
