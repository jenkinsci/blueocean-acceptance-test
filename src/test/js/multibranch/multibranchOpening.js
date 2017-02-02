const jobName = 'withGitFlow';
const path = require("path");
const pathToRepo = path.resolve('./target/test2-project-folder');
const soureRep = './src/test/resources/multibranch_2';
const git = require("../../../main/js/api/git");

/** @module multibranchOpening
 * @memberof multibranch
 * @description Check we run and open results screen for multibranch projects, 
 *              and that the stage graph shows and completes.
 */
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
     * Make sure we can open the master branch results screen from activity
     */
    'open master branch from activity': function (browser) {

         var jobName = "masterActivityMB";      
         var multibranchCreate = browser.page.multibranchCreate().navigate();      
         multibranchCreate.createBranch(jobName, pathToRepo);

         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');

         blueActivityPage.waitForElementVisible('tr[id^="master"]');
         blueActivityPage.click('tr[id^="master"]');
         
         blueActivityPage.assertStageGraphShows();
                  
         
    },
    
    
    /**
     * Make sure we can open the master branch from branch screen
     */
    'open master branch from branches tab': function (browser) {
      
        var jobName = "masterBranchesMB";      
        var multibranchCreate = browser.page.multibranchCreate().navigate();      
        multibranchCreate.createBranch(jobName, pathToRepo);

         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
         blueActivityPage.click(".branches");

         blueActivityPage.waitForElementVisible('tr[id^="master"]');
         blueActivityPage.click('tr[id^="master"]');
                  
         blueActivityPage.assertStageGraphShows();

    },
    
    /**
     * Make sure we can open the feature/1 branch results screen from activity
     * Regression: https://issues.jenkins-ci.org/browse/JENKINS-40027     
     */
    'open feature/1 branch from activity': function (browser) {
      
        var jobName = "featureActivityMB";      
        var multibranchCreate = browser.page.multibranchCreate().navigate();      
        multibranchCreate.createBranch(jobName, pathToRepo);

         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');

         blueActivityPage.waitForElementVisible('tr[id^="feature"]');
         blueActivityPage.click('tr[id^="feature"]');
         
         blueActivityPage.assertStageGraphShows();
         
    },
    
    
    /**
     * Make sure we can open the feature/1 branch from branch screen
     * Regression: https://issues.jenkins-ci.org/browse/JENKINS-40027     
     */
    'open feature/1 from branches tab': function (browser) {
      
        var jobName = "featureBranchesMB";      
        var multibranchCreate = browser.page.multibranchCreate().navigate();      
        multibranchCreate.createBranch(jobName, pathToRepo);

      
         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
         blueActivityPage.waitForElementVisible('.branches');
         blueActivityPage.click(".branches");

         blueActivityPage.waitForElementVisible('tr[id^="feature"]');
         blueActivityPage.click('tr[id^="feature"]');

         blueActivityPage.assertStageGraphShows();
   
    }

}
