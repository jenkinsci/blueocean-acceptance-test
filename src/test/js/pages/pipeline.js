// Pipeline page object (http://nightwatchjs.org/guide#page-objects)

var pipelineClientSSEClientId = 'blueocean_acceptance_tests_pipeline';

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
var commands = {
    forJob: function(jobName) {
        var jobUrl = this.api.launchUrl + 'job/' + jobName;
        return this.navigate(jobUrl);
    },
    build: function(onBuildComplete) {
        if (onBuildComplete) {
            // Ok, we want to know when the build completes and call the callback
            // we'll use SSE Event notifications for this.
            var sse = require('../api/sse');
            var self = this;
            sse.connect(this.api.launchUrl, pipelineClientSSEClientId, function(sseClient) {
                // Wait fort he job channel subs before triggering the build...
                sseClient.subscribe('sse', function (event) {
                    if (event.sse_subs_channel_name === 'sse') {
                        // Subscribed to the 'sse' channel now i.e. we
                        // can hear when the following 'job' channel
                        // subs is setup.
                        sseClient.subscribe('job', function (event) {
                            try {
                                sseClient.disconnect();
                            } finally {
                                onBuildComplete(event);
                            }
                        }, {
                            jenkins_event: 'job_run_ended'
                        });
                    } else if (event.sse_subs_channel_name === 'job') {
                        // Subscribed to the 'job' channel now i.e. we
                        // can now hear when the job is complete so it's ok.
                        // to trigger it.
                        self.click('@build');
                    }
                }, {
                    jenkins_event: 'subscribe',
                    sse_subs_dispatcher: pipelineClientSSEClientId,
                });
            });
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