const jobName = 'noRunsActivityPage';
/** @module failing
 * @memberof testcases
 * @description TEST: basic tests around the failing pipeline. Test whether the result is not collapsed.
 */
module.exports = {
    /**
     * Create Multibranch Pipeline Job "noRunsActivityPage" with no branches.
     * @param browser
     */
    'Step 01': function (browser) {
        var multibranchCreate = browser.page.multibranchCreate().navigate();
      
        multibranchCreate.createBranch(jobName);
    },
    /**
     * Make sure that we show the empty state.
     */
    'Step 02': function (browser) {
         var blueActivityPage = browser.page.bluePipelineActivity().forJob(jobName, 'jenkins');

         blueActivityPage.waitForElementVisible('@emptyStateShoes');
    }
}