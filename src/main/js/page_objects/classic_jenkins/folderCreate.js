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
    createFreestyle: function (browser, jobName, script) {
        var self = this;
        browser.url(function (response) {
            const url = response.value + suffix;
            const jobName = 'Sohn';
            self.navigate(url);
            self.setValue('@nameInput', jobName);
            self.click('@freestyleType');
            self.click('@submit');

            // self.waitForJobCreated(jobName);

            // Navigate to the job config page and set the freestyle script.
            self.api.page.freestyleConfig()
                .setFreestyleScript(script)
                .click('@save', function () {
                });

        });
    },
    createFolder: function(browser, folderName, subfolders) {
        var self = this;

        self.waitForJobDeleted(folderName);

        self.setValue('@nameInput', folderName);
        self.click('@folderType');
        self.click('@submit');
        self.waitForElementPresent('@save')
            .click('@save');

        if (subfolders) {
            subfolders.map(function(item) {
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
        }

    },
}];