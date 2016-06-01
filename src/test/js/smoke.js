module.exports = {
    'Create Pipeline Job': function (browser) {
        var job = require('../../main/js/api/job');
                
        job.newPipeline(browser, 'my-pipeline', 'three-stages.groovy', function() {
            browser.end();
        });
    },

    'Check Job on Blue Ocean Pipelines Page': function (browser) {
        var bluePipelinesPage = browser.page.bluePipelines().navigate();
        
        bluePipelinesPage.assertBasicLayoutOkay();
        bluePipelinesPage.assertJob('my-pipeline');
    },

    'Check Job Blue Ocean Pipeline Activity Page is empty': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline');
        
        blueActivityPage.assertBasicLayoutOkay();
        blueActivityPage.waitForElementVisible('@emptyStateShoes', 1000);
    },

    'Build Pipeline Job': function (browser) {
        var pipelinePage = browser.page.pipeline().forJob('my-pipeline');
        pipelinePage.build(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage = browser.page.pipeline().forJob('my-pipeline');
            pipelinePage.waitForElementVisible('@builds', 1000);
            browser.end();
        });
    },

    'Check Job Blue Ocean Pipeline Activity Page has run': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline');
        
        blueActivityPage.assertBasicLayoutOkay();
        blueActivityPage.expect.element('@emptyStateShoes').to.not.be.present.before(1000);
        
        // Check the run itself
        blueActivityPage.waitForElementVisible('.activity-table tr#my-pipeline-1', 1000);
        blueActivityPage.waitForElementVisible('.activity-table tr#my-pipeline-1 svg.svgResultStatus', 1000);
        blueActivityPage.waitForElementPresent('.activity-table tr#my-pipeline-1 svg circle.success', 1000);
        
        browser.end();
    }
};
