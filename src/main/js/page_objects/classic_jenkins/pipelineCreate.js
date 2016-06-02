// Pipeline create (new item) page object (http://nightwatchjs.org/guide#page-objects)

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
            self.click('@submit', function () {
                self.api.page.pipelineConfig().forJob(jobName)
                    .setPipelineScript(script)
                    .click('@save', oncreated);
            });
        });
    },
    deletePipeline: function(jobName, ondeleted) {
        var deleteUrl = this.api.launchUrl + 'job/' + jobName + '/doDelete';
        request.post(deleteUrl, ondeleted);
    }
}];