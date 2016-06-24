var git = require('../../main/js/api/git');

module.exports = {
    beforeEach: function (browser, done) {
        git.createRepo('./src/test/resources/multibranch_1', './target/test-project')
            .then(function() {
                git.createBranch('feature-1', './target/test-project')
                    .then(done);
            });
    },

    'Create Multbranch Job': function (browser) {
        console.log('*** test!!');
        browser.end();
    }
};