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

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    createFreestyle: function(browser, jobName, script, oncreated) {
        var self = this;
        
        self.waitForJobDeleted(jobName);

        self.setValue('@nameInput', jobName);
        self.click('@freestyleType');
        self.click('@submit');

        self.waitForJobCreated(jobName);

        if (!oncreated) {
            // If no oncreated function was supplied then we manufacture
            // a dummy. This ensures that this function does not return
            // immediately.
            oncreated = function() {};
        }

        // Navigate to the job config page and set the freestyle script.
        self.api.page.freestyleConfig().forJob(jobName)
            .setFreestyleScript(script)
            .click('@save', oncreated);
    },
}];