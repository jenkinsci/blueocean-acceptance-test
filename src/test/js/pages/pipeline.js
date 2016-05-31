// Pipeline page object (http://nightwatchjs.org/guide#page-objects)

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
var commands = {
    forJob: function(jobName) {
        var jobUrl = this.api.launchUrl + 'job/' + jobName;
        return this.navigate(jobUrl);
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