module.exports = {
    'Create Pipeline Job': function (browser) {
        var job = require('../../main/js/api/job');
        
        job.newPipeline(browser, 'my-pipeline', 'three-stages.groovy', function() {
            var pipelinePage = browser.page.pipeline().forJob('my-pipeline');
            pipelinePage.build(function(event) {
                browser.pause(1000);
                browser.end();
            });
        });
    }
};
