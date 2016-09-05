var url = require('../../util/url');

module.exports = {
    elements: {
        runButton: 'div.actions a.run-button',
        toasts: 'div.toaster div.toast span.text'
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    clickRunButton: function (browser) {
        var self = this;
        self.waitForElementVisible('@runButton');
        self.click('@runButton');
        browser.elements('css selector', 'div.toaster div.toast span.text', function (codeCollection) {
            this.assert.equal(codeCollection.value.length, 2);
            codeCollection.value.map(function (item) {
                browser.elementIdText(item.ELEMENT, function (value) {
                    var passed = value.value.indexOf('Queued');
                    if (passed === -1) {
                        passed = value.value.indexOf('Started');
                    }
                    self.assert.equal(passed > -1, true);
                })
            })
        });
    }
}];