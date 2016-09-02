
const url = require('../../util/url');
const configureBuildExecutor = url.configureBuildExecutor();

module.exports = {

    url: function () {
        return this.api.launchUrl + configureBuildExecutor;
    },
    elements: {
        computer: 'img.icon-computer',
        noExecutors: 'input[path="/numExecutors"]',
        labels: 'input[path="/labelString"]',
        save: {
            selector: '//button[.="Save"]',
            locateStrategy: 'xpath',
        },
        form: 'form[name="config"]'
    }
};

module.exports.commands = [{
    setNumber: function (browser, newNumber) {
        var self = this;
        self.waitForElementPresent('@noExecutors');
        self.clearValue('@noExecutors');
        self.setValue('@noExecutors', newNumber);
        self.clearValue('@labels');// to loose focus on the
        self.waitForElementPresent('@form');
        browser.submitForm('form[name="config"]', function (submitted) {
            self.waitForElementPresent('@computer');
            browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                self.assert.equal(response.value.includes('configure'), false);
                return self;
            })

        });
    }

}];