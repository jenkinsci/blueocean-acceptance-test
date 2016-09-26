/** @module freestyleCreate
 * @memberof page_objects
 * @description Represents the freestyle creation page of classic jenkins.
 *
 * */

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

module.exports.commands = [{
    /**
     * Returns the create freestyle page for a certain job and creates the freestyle job
     * @param jobName {String} name of the job to configure
     * @param script{String} the name of the script that shoould be used to be injected. Has to
     * be present in ROOT/src/test/resources/test_scripts
     * @param {Function} [oncreated] - callback to be invoke when finished, will expect a traditional node callback function
     */
    createFreestyle: function(jobName, script, oncreated) {
        var self = this;
        
        self.waitForJobDeleted(jobName);

        self.setValue('@nameInput', jobName);
        self.moveClassicBottomStickyButtons();
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