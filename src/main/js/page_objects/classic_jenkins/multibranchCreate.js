const url = require('../../util/url');

// Pipeline create (new item) page object (http://nightwatchjs.org/guide#page-objects)
const suffix = 'newJob';

module.exports = {
    url: function () {
        return this.api.launchUrl + '/view/All/' + suffix;
    },
    elements: {
        nameInput: '#name',
        multibranchType: 'li.org_jenkinsci_plugins_workflow_multibranch_WorkflowMultiBranchProject',
        submit: '#ok-button',
        save: 'span.yui-button[name="Submit"]',
        button: {
            selector: '//button[@path="/hetero-list-add[sources]"]',
            locateStrategy: 'xpath',
        },
        scriptHook: {
            selector: '//input[@path="/sources/source/remote"]',
            locateStrategy: 'xpath',
        },
        gitA: {
            selector: '//a[text()="Git"]',
            locateStrategy: 'xpath',
        }
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{

    forJob: function(jobName) {
        var jobUrl = url.getJobUrl(this.api.launchUrl, jobName) + suffix;
        this.jobName = jobName;
        return this.navigate(jobUrl);
    },

    createBranch: function (folderName, path) {
        var self = this;

        self.waitForJobDeleted(folderName);

        self.setValue('@nameInput', folderName);

        self.waitForElementPresent('@multibranchType');
        self.click('@multibranchType');
        self.waitForElementPresent('@submit');
        self.click('@submit');
        self.waitForElementPresent('@button');
        self.click('@button');
        self.waitForElementPresent('@gitA');
        self.click('@gitA');
        self.waitForElementPresent('@scriptHook');
        self.setValue('@scriptHook', path);

        self.waitForElementPresent('@save')
            .click('@save');

    },
}];