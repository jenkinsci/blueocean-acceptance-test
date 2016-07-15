var sse = require('./api/sse');
var debug = require('./api/debug');

module.exports = {
    waitForConditionTimeout: 20000,
    default: {
        beforeEach: function (browser, done) {
            //debug.enable('sse');
            sse.connect(browser, done);
        },
        afterEach: function () {
            sse.disconnect();
        }
    }
};