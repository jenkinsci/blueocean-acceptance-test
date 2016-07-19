// Pipeline create (new item) page object (http://nightwatchjs.org/guide#page-objects)

var sseClient = require('../../api/sse');

module.exports = {
    url: function () {
        return this.api.launchUrl + '/view/All/newJob';
    },
    elements: {
        nameInput: '#name',
        pipelineJobType: 'li.org_jenkinsci_plugins_workflow_job_WorkflowJob',
        submit: '#ok-button'
    }
};

var request = require('request');

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    createPipeline: function(jobName, script, oncreated) {
        var self = this;
        
        self.deletePipeline(jobName, function() {
            self.setValue('@nameInput', jobName);
            self.click('@pipelineJobType');
            
            // Add an event listener to catch the job created CRUD event.
            console.log('Waiting on job "' + jobName + '" to be created.');
            sseClient.onJobCreated(jobName, function () {
                console.log('Job "' + jobName + '" created. Navigating to config page.');
                
                // Navigate to the job config page and set the pipeline script.
                self.api.page.pipelineConfig().forJob(jobName)
                    .setPipelineScript(script)
                    .click('@save', oncreated);
            });
            
            self.click('@submit');
        });
    },
    deletePipeline: function(jobName, ondeleted) {
        var deleteUrl = this.api.launchUrl + 'job/' + jobName + '/doDelete';
        request.post(deleteUrl, ondeleted);
    }
}];