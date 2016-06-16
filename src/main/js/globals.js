var sse = require('./api/sse');

module.exports = {
    waitForConditionTimeout: 20000,
    default: {
        beforeEach: function (browser, done) {
            sse.connect(browser, done);
        },
        afterEach: function () {
            sse.disconnect();
        }
    }
};