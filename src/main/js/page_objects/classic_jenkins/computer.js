
const url = require('../../util/url');
const configureBuildExecutor = url.configureBuildExecutor();

module.exports = {

    url: function () {
        return this.api.launchUrl + configureBuildExecutor;
    },
    elements: {
        noExecutors: 'input[path="/numExecutors"]',
        save: 'button#yui-gen2-button',
    }
};

module.exports.commands = [{
    setNumber: function (newNumber) {
        var self = this;
        self.waitForElementPresent('@noExecutors');
        self.clearValue('@noExecutors');
        self.setValue('@noExecutors', newNumber);
        self.waitForElementPresent('@save')
            .click('@save');
    }

}];