
const url = require('../../util/url');
const configureBuildExecutor = url.configureBuildExecutor();

module.exports = {

    url: function () {
        return this.api.launchUrl + configureBuildExecutor;
    },
    elements: {
        computer: 'img.icon-computer',
        noExecutors: 'input[path="/numExecutors"]',
        save: {
            selector: '//button[.="Save"]',
            locateStrategy: 'xpath',
        },
        form: {
            selector: '//form[@name="config"]',
            locateStrategy: 'xpath',
        }
    }
};

module.exports.commands = [{
    setNumber: function (browser, newNumber) {
        var self = this;
        self.waitForElementPresent('@noExecutors');
        self.clearValue('@noExecutors');
        self.setValue('@noExecutors', newNumber);
        self.waitForElementPresent('@save');
        self.click('@save', function (status) {
            console.log(status);
            self.waitForElementPresent('@computer')
            browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                self.assert.equal(response.value.includes('configure'), false);
                return self;
            })

        });
    }

}];