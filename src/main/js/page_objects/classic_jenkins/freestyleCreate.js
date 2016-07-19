// Pipeline create (new item) page object (http://nightwatchjs.org/guide#page-objects)

var sseClient = require('../../api/sse');

module.exports = {
    url: function () {
        return this.api.launchUrl + '/view/All/newJob';
    },
    elements: {
        nameInput: '#name',
        freestyleType: 'li.hudson_model_FreeStyleProject',
        submit: '#ok-button'
    }
};

const request = require('request');

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    createFreestyle: function(jobName, script, oncreated) {
        const self = this;
        
        self.deleteFreestyle(jobName, function() {
            self.setValue('@nameInput', jobName);
            self.click('@freestyleType');
            
            // Add an event listener to catch the job created CRUD event.
            sseClient.onJobCreated(jobName, function () {
                console.log('Job "' + jobName + '" created. Navigating to config page.');
                
                // Navigate to the job config page and set the freestyle script.
                self.api.page.freestyleConfig().forJob(jobName)
                    .setFreestyleScript(script)
                    .click('@save', oncreated);
            });
            
            self.click('@submit');
        });
    },
    deleteFreestyle: function(jobName, ondeleted) {
        const deleteUrl = this.api.launchUrl + 'job/' + jobName + '/doDelete';
        request.post(deleteUrl, ondeleted);
    }
}];