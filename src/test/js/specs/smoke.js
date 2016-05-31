module.exports = {
    'Create Pipeline Job': function (browser) {
        var job = require('../api/job');
        
        job.newPipeline(browser, 'my-pipeline', 'three-stages.groovy', function() {
            var pipelinePage = browser.page.pipeline().forJob('my-pipeline');
            pipelinePage.click('@build', function() {
                browser.pause(10000).end();
            });
        });
    }
};
