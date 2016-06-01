module.exports = {
    'Create Pipeline Job': function (browser) {
        var job = require('../../main/js/api/job');
                
        job.newPipeline(browser, 'my-pipeline', 'three-stages.groovy', function() {
            browser.end();
        });
    },

    'Build Pipeline Job': function (browser) {
        var pipelinePage = browser.page.pipeline().forJob('my-pipeline');
        pipelinePage.build(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage = browser.page.pipeline().forJob('my-pipeline');
            pipelinePage.waitForElementVisible('@builds', 1000);
            browser.end();
        });
    }
};
