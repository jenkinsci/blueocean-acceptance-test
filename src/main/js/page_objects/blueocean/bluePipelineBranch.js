var url = require('../../util/url');

module.exports = {
    elements: {
        runButton: 'div.actions div.run-pipeline',
    }
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
module.exports.commands = [{
    clickRunButton: function () {
       var self = this;
       self.waitForElementVisible('@runButton');
       self.click('@runButton');
    }
}];