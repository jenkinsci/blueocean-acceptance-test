module.exports = {
    'Create Pipeline Job': function (browser) {
        var job = require('../api/job');
        
        job.newPipeline(browser, 'my-pipeline', 'three-stages.groovy', function() {
            browser.pause(5000).end();
        });
    }
};
