// Pipeline page object (http://nightwatchjs.org/guide#page-objects)

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
var commands = {
    forJob: function(jobName) {
        var jobUrl = this.api.launchUrl + 'job/' + jobName;
        this.jobName = jobName;
        return this.navigate(jobUrl);
    },
    build: function(onBuildComplete) {
        if (onBuildComplete) {
            // Ok, we want to know when the build completes and call the callback.
            // We'll use SSE Event notifications for this.
            var sseClient = require('../api/sse');
            sseClient.onJobRunEnded(this.jobName, onBuildComplete);
            this.click('@build');
        } else {
            this.click('@build');
        }
        
        return this;
    }
};

module.exports = {
    commands: [commands],
    elements: {
        build: {
            selector: '//a[text()="Build Now"]',
            locateStrategy: 'xpath' 
        }
    }
};