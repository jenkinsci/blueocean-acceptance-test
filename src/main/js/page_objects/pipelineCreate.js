// Pipeline create (new item) page object (http://nightwatchjs.org/guide#page-objects)

module.exports = {
    url: function () {
        return this.api.launchUrl + '/view/All/newJob';
    },
    elements: {
        nameInput: {
            selector: '#name'
        },
        pipelineJobType: {
            selector: 'li.org_jenkinsci_plugins_workflow_job_WorkflowJob'
        },
        submit: {
            selector: '#ok-button'
        }
    }
};
