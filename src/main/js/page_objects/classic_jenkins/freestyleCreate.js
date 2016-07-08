// Pipeline create (new item) page object (http://nightwatchjs.org/guide#page-objects)

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

var request = require('request');

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    createFreestyle: function(jobName, script, oncreated) {
        var self = this;
        
        self.deleteFreestyle(jobName, function() {
            self.setValue('@nameInput', jobName);
            self.click('@freestyleType');
            self.click('@submit', function () {
                self.api.page.freestyleConfig().forJob(jobName)
                    .setFreestyleScript(script)
                    .click('@save', oncreated);
            });
        });
    },
    deleteFreestyle: function(jobName, ondeleted) {
        var deleteUrl = this.api.launchUrl + 'job/' + jobName + '/doDelete';
        request.post(deleteUrl, ondeleted);
    }
}];