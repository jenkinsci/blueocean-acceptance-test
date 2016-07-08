// Pipeline page object (http://nightwatchjs.org/guide#page-objects)
exports.elements = {
    build: {
        selector: '//a[text()="Build Now"]',
        locateStrategy: 'xpath',
    },
    executer: {
        selector: '//span[text()="Started by anonymous user"]',
        locateStrategy: 'xpath',
    },
    builds: '#buildHistory .build-row-cell .icon-blue'
};


// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
exports.commands = [{
    forJob: function(jobName) {
        var jobUrl = this.api.launchUrl + 'job/' + jobName;
        this.jobName = jobName;
        return this.navigate(jobUrl);
    },
    forRun: function(runId) {
        var runUrl = this.api.launchUrl + 'job/' + this.jobName + '/' + runId;
        return this.navigate(runUrl);
    },
    build: function(onBuildComplete) {
        this.click('@build');
        if (onBuildComplete) {
            this.api.waitForJobRunEnded(this.jobName, onBuildComplete);
        }
        return this;
    },
    buildStarted: function(onBuildStarted) {
        this.click('@build');
        if (onBuildStarted) {
            this.api.waitForJobRunStarted(this.jobName, onBuildStarted);
        }
        return this;
    }
}];