const jobName = 'withGitFlow';
const path = require("path");
const pathToRepo = path.resolve('./target/test2-project-folder');
const soureRep = './src/test/resources/multibranch_2';
const git = require("../../../main/js/api/git");

/** @module filtering
 * @memberof multibranch
 * @description Check that can filter the activity list
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

         var jobName = "filterActivityMB";      
         var multibranchCreate = browser.page.multibranchCreate().navigate();      
         multibranchCreate.createBranch(jobName, pathToRepo);

         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');
         
         blueActivityPage.waitForElementVisible('input.autocomplete');         
         blueActivityPage.click('input.autocomplete');
         blueActivityPage.waitForElementVisible('.item');                                    
         
         browser.elements('css selector', 'tbody tr', function(res) {
           browser.assert.equal(2, res.value.length, 'Correct number of runs filtered down');          
         })

         
         blueActivityPage.click('.item');                                    
         
         browser.elements('css selector', 'tbody tr', function(res) {
           browser.assert.equal(1, res.value.length, 'Correct number of runs filtered down');          
         })
         
         
    },
    
    

}
