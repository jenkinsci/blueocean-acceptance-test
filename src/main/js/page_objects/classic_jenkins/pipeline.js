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
        this.click('@build');
        if (onBuildComplete) {
            this.api.waitForJobRunEnded(this.jobName, onBuildComplete);
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
        },
        builds: {
            selector: '#buildHistory .build-row-cell .icon-blue'
        }
    }
};