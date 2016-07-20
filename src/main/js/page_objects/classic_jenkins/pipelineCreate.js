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

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    createPipeline: function(jobName, script, oncreated) {
        var self = this;
        
        self.waitForJobDeleted(jobName);

        self.setValue('@nameInput', jobName);
        self.click('@pipelineJobType');
        self.click('@submit');

        self.waitForJobCreated(jobName);

        // Navigate to the job config page and set the pipeline script.
        self.api.page.pipelineConfig().forJob(jobName)
            .setPipelineScript(script)
            .click('@save', oncreated);
    },
}];