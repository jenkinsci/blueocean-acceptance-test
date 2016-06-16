module.exports = {
    'Create Pipeline Job': function (browser) {
        var pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline('my-pipeline', 'three-stages.groovy', function() {
            browser.end();
        });
    },

    'Check Job on Blue Ocean Pipelines Page': function (browser) {
        var bluePipelinesPage = browser.page.bluePipelines().navigate();
        
        bluePipelinesPage.assertBasicLayoutOkay();
        bluePipelinesPage.assertJob('my-pipeline');
    },

    'Check Job Blue Ocean Pipeline Activity Page is empty': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline', 'jenkins');
        
        blueActivityPage.assertBasicLayoutOkay();
        blueActivityPage.waitForElementVisible('@emptyStateShoes');
    },

    'Build Pipeline Job': function (browser) {
        var pipelinePage = browser.page.pipeline().forJob('my-pipeline');
        pipelinePage.build(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage = browser.page.pipeline().forJob('my-pipeline');
            pipelinePage.waitForElementVisible('@builds');
            browser.end();
        });
    },

    'Check Job Blue Ocean Pipeline Activity Page has run': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('my-pipeline', 'jenkins');
        
        blueActivityPage.assertBasicLayoutOkay();
        blueActivityPage.expect.element('@emptyStateShoes').to.not.be.present.before(1000);
        
        // Check the run itself
        blueActivityPage.waitForRunVisible('my-pipeline-1');
    },

    'Check Job Blue Ocean Pipeline run detail page': function (browser) {
        var blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('my-pipeline', 'jenkins', 1);
        
        blueRunDetailPage.assertBasicLayoutOkay();
        
        browser.end();
    }
};
