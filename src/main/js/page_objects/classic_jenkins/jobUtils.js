const url = require('../../../../main/js/util/url');

// Pipeline page object (http://nightwatchjs.org/guide#page-objects)
exports.elements = {
    build: {
        selector: '//a[text()="Build Now"]',
        locateStrategy: 'xpath',
    },
    queued: 'div[title="Expected build number"]',
    indexing: {
        selector: '//a[text()="Run Now"]',
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
    forJob: function(jobName, suffix) {
        var jobUrl = url.getJobUrl(this.api.launchUrl, jobName);
        this.jobName = jobName;
        return this.navigate(suffix ? jobUrl + suffix : jobUrl);
    },
    forRun: function(runId) {
        var runUrl = url.getJobUrl(this.api.launchUrl, this.jobName) + runId;
        return this.navigate(runUrl);
    },
    forUrl: function (url, jobName) {
        this.jobName = jobName;
        return this.navigate(url);
    },
    build: function(onBuildComplete) {
        this.waitForElementVisible('@build');
        this.click('@build');
        if (onBuildComplete) {
            this.api.waitForJobRunEnded(this.jobName, onBuildComplete);
        }
        return this;
    },
    buildStarted: function(onBuildStarted) {
        this.waitForElementVisible('@build');
        this.click('@build');
        if (onBuildStarted) {
            this.api.waitForJobRunStarted(this.jobName, onBuildStarted);
        }
        return this;
    },
    buildQueued: function() {
        this.waitForElementVisible('@build');
        this.click('@build');
        this.waitForElementVisible('@queued');
        return this;
    },
    indexingStarted: function(onIndexingStarted) {
        this.waitForElementVisible('@indexing');
        this.click('@indexing');
        if (onIndexingStarted) {
            this.api.waitForJobRunStarted(this.jobName, onIndexingStarted);
        }
        return this;
    }
}];