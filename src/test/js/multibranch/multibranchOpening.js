const jobName = 'withGitFlow';
const path = require("path");
const pathToRepo = path.resolve('./target/test2-project-folder');
const soureRep = './src/test/resources/multibranch_1';
const git = require("../../../main/js/api/git");


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
     * Create Multibranch Pipeline Job with git flow named branches 
     * @param browser
     */
    'Step 01': function (browser) {
        var multibranchCreate = browser.page.multibranchCreate().navigate();
      
        multibranchCreate.createBranch(jobName, pathToRepo);
    },
    
    /**
     * Make sure we can open the master branch results screen from activity
     */
    'Step 02': function (browser) {
         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');

         blueActivityPage.waitForElementVisible('tr[id^="master"]');
         blueActivityPage.click('tr[id^="master"]');
         blueActivityPage.waitForElementVisible('.replay-button')         
         
    },
    
    
    /**
     * Make sure we can open the master branch from branch screen
     */
    'Step 03': function (browser) {
         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
         blueActivityPage.click(".branches");

         blueActivityPage.waitForElementVisible('tr[id^="master"]');
         blueActivityPage.click('tr[id^="master"]');
         blueActivityPage.waitForElementVisible('.replay-button')         
         
    },
    
    /**
     * Make sure we can open the feature/1 branch results screen from activity
     * Regression: https://issues.jenkins-ci.org/browse/JENKINS-40027
     */
    'Step 04': function (browser) {
         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');

         blueActivityPage.waitForElementVisible('tr[id^="feature"]');
         blueActivityPage.click('tr[id^="feature"]');
         blueActivityPage.waitForElementVisible('.replay-button')         
         
    },
    
    
    /**
     * Make sure we can open the feature/1 branch from branch screen
     */
    'Step 05': function (browser) {
         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
         blueActivityPage.click(".branches");

         blueActivityPage.waitForElementVisible('tr[id^="feature"]');
         blueActivityPage.click('tr[id^="feature"]');
         blueActivityPage.waitForElementVisible('.replay-button')         
         
    }


}
