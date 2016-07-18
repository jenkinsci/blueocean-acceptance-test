var sse = require('./api/sse');

require('./api/debug');

module.exports = {
    waitForConditionTimeout: 20000,
    default: {
        beforeEach: function (browser, done) {
            sse.connect(browser, done);
        },
        afterEach: function (browser, done) {
            sse.disconnect(function() {
                done();
            });
        }
    }
};