var sse = require('./api/sse');

module.exports = {
    'default': {
        beforeEach: function (browser, done) {
            sse.connect(browser, done);
        },
        afterEach: function () {
            sse.disconnect();
        }
    }
};