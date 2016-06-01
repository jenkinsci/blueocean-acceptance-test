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
