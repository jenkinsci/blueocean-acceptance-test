/** @module smoke
 * @memberof testcases
 * @description TEST: basic tests around the pipeline. This includes creating and running a pipeline job, validating
 * the activity view for empty and populated state. Further we validate the detail page with very basic matchers.
 * We then try to press the "run" button on the activities tab and validate the Toast.
 * To wrap up we are trying different urls which should result in 404 pages.
 */
const async = require("async");
module.exports = {
    /**
     * Create Pipeline Job
     * @param browser
     */
    'Step 01': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline('my-pipeline', 'three-stages.groovy');
    },

    /**
     * Check Job on Blue Ocean Pipelines Page
     * @param browser
     */
    'Step 02': function (browser) {
        const bluePipelineActivity = browser.page.bluePipelineActivity();
        const bluePipelinesPage = browser.page.bluePipelines();

        // make sure the open blue ocean button works. In this case,
        // it should bring the browser to an empty pipeline activity
        // page.
        browser.openBlueOcean();
        bluePipelineActivity.assertEmptyLayoutOkay('my-pipeline');
        browser.assert.urlEndsWith('/blue/organizations/jenkins/my-pipeline/activity');

        bluePipelinesPage.navigate();
        bluePipelinesPage.assertBasicLayoutOkay();
        bluePipelinesPage.assertJob('my-pipeline');
    },

    /**
     * Check Job Blue Ocean Pipeline Activity Page is empty
     * @param browser
     */
    'Step 03': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline', 'jenkins');
        
        blueActivityPage.assertBasicLayoutOkay();
        blueActivityPage.waitForElementVisible('@emptyStateShoes');
    },

    /**
     * Build Pipeline Job
     * @param browser
     */
    'Step 04': function (browser) {
        const pipelinePage = browser.page.jobUtils().forJob('my-pipeline');
        pipelinePage.build(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage = browser.page.jobUtils().forJob('my-pipeline');
            pipelinePage.waitForElementVisible('@builds');
        });
    },

    /**
     * Check Job Blue Ocean Pipeline Activity Page has run
     * @param browser
     */
    'Step 05': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline', 'jenkins');
        
        blueActivityPage.assertBasicLayoutOkay();
        blueActivityPage.expect.element('@emptyStateShoes').to.not.be.present.before(1000);
        
        // Check the run itself
        blueActivityPage.waitForRunSuccessVisible('my-pipeline-1');
    },

    /**
     * Check Job Blue Ocean Pipeline run detail page
     * @param browser
     */
    'Step 06': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('my-pipeline', 'jenkins', 1);
        
        blueRunDetailPage.assertBasicLayoutOkay();
    },

    /**
     * On Activity Page click the run button, then click the open in toast
     * and then validate that we are on the detail page.
     * Regression test @see {@link https://issues.jenkins-ci.org/browse/JENKINS-38240|JENKINS-38240}
     * @param browser
     */
    'Step 07': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline', 'jenkins');
        blueActivityPage.clickRunButtonAndOpenDetail();
        // Check the run itself
        browser.page.bluePipelineRunDetail().assertBasicLayoutOkay();
    },

    /**
     * Trying out different urls that should result in the same 404 page
     * @param browser
     */
    'Step 08': function (browser) {
        // test different levels for 404
        var urls = ['/blue/gibtEsNicht', '/blue/organizations/gibtEsNicht', '/blue/organizations/gibtEsNicht/gibtEsNicht/detail/gibtEsNicht/'];
        async.mapSeries(urls, function (url, callback) {
            console.log('trying url', url);
            // navigate to the url
            browser.url(url, function(result) {
                console.log(result)
                browser.page.blueNotFound().assertBasicLayoutOkay();
            });
        });
    }

};
