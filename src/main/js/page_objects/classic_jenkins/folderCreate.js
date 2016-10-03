const url = require('../../util/url');
const suffix = 'newJob';
/** @module folderCreate
 * @memberof page_objects
 * @description Represents the folder create page, which is a wrapper around the classic
 * create job page of jenkins.
 *
 * If called as in the example it is the same as
 * ```https://ci.blueocean.io/view/All/newJob```
 *
 * @example
 * const folderCreate = browser.page.folderCreate().navigate();
 * */
module.exports = {
    url: function () {
        return this.api.launchUrl + '/view/All/' + suffix;
    },
    elements: {
        nameInput: '#name',
        folderType: 'li.com_cloudbees_hudson_plugins_folder_Folder',
        freestyleType: 'li.hudson_model_FreeStyleProject',
        submit: '#newFormSubmitButtonForATH',
        configForm: 'form[name="config"]',
        configSave: '#newFormSubmitButtonForATH'
    }
};

module.exports.commands = [{
    /**
     * Create a freestyle project in a certain path
     * @example folderCreate.createFreestyle(folders.join('/'), jobName, 'freestyle.sh');
     * @param basePath {String} may be a nested path
     * @param jobName {String} the name of the new job to be created
     * @param script {String} the file name of the freestyle script in ROOT/src/test/resources/test_scripts
      */

    createFreestyle: function (basePath, jobName, script) {
        var self = this;
        const browser = this.api;
        const fullProjectName = basePath+  '/' + jobName;
        const link = url.getJobUrl(this.api.launchUrl, basePath);
        self.navigate(link+ suffix);
        self.setValue('@nameInput', jobName);
        self.click('@freestyleType');
        self.click('@submit');

        self.waitForJobCreated(fullProjectName);

        // Navigate to the job config page and set the freestyle script.
        self.api.page.freestyleConfig()
            .waitForElementPresent('@configForm')
            .setFreestyleScript(script)
            .click('@configSave', function () {
            });
    },
    /**
     * Create a path of folders.
     * @example folderCreate.createFolders(['firstFolder', '三百', 'ñba', '七']);
     * @param folders {Array} an array of {String} representing a deep path
     */
    createFolders: function(folders) {
        var self = this;
        const browser = this.api;
        // we do not want to modify the original array
        const clone = folders.slice();
        const firstChild = clone.shift();
        // delete the root project/folder
        self.waitForJobDeleted(firstChild);

        self.setValue('@nameInput', firstChild);
        self.click('@folderType');
        self.click('@submit');
        self.waitForElementPresent('@configForm')
        self.waitForElementPresent('@configSave')
            .click('@configSave');

        clone.map(function(item) {
            browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                const subFolderUrl = response.value + suffix;
                self.navigate(subFolderUrl);
                self.setValue('@nameInput', item);
                self.click('@folderType');
                self.click('@submit');
                self.waitForElementPresent('@configForm')
                self.waitForElementPresent('@configSave')
                   .click('@configSave');
                return self;
            })
        })

    },
}];