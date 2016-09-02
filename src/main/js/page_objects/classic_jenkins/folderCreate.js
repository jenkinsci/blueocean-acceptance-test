const url = require('../../util/url');

// Pipeline create (new item) page object (http://nightwatchjs.org/guide#page-objects)
const suffix = 'newJob';

module.exports = {
    url: function () {
        return this.api.launchUrl + '/view/All/' + suffix;
    },
    elements: {
        nameInput: '#name',
        folderType: 'li.com_cloudbees_hudson_plugins_folder_Folder',
        freestyleType: 'li.hudson_model_FreeStyleProject',
        submit: '#ok-button',
        save: 'span.yui-button[name="Submit"]'
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    /*
     @param basePath may be a nested path
     @param jobName the name of the new job to be created
      */

    createFreestyle: function (browser, basePath, jobName, script) {
        var self = this;
        const fullProjectName = basePath+  '/' + jobName;
        const link = url.getJobUrl(this.api.launchUrl, basePath);
        self.navigate(link+ suffix);
        self.setValue('@nameInput', jobName);
        self.click('@freestyleType');
        self.click('@submit');

        self.waitForJobCreated(fullProjectName);

        // Navigate to the job config page and set the freestyle script.
        self.api.page.freestyleConfig()
            .setFreestyleScript(script)
            .click('@save', function () {
            });
    },
    createFolders: function(browser, folders) {
        var self = this;
        // we do not want to modify the original array
        const clone = folders.slice();
        const firstChild = clone.shift();
        // delete the root project/folder
        self.waitForJobDeleted(firstChild);

        self.setValue('@nameInput', firstChild);
        self.click('@folderType');
        self.click('@submit');
        self.waitForElementPresent('@save')
            .click('@save');

        clone.map(function(item) {
            browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                const subFolderUrl = response.value + suffix;
                self.navigate(subFolderUrl);
                self.setValue('@nameInput', item);
                self.click('@folderType');
                self.click('@submit');
                self.waitForElementPresent('@save')
                   .click('@save');
                return self;
            })
        })

    },
}];