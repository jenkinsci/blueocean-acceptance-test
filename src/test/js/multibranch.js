const git = require('../../main/js/api/git');
const path = require("path");

const pathToRepo = path.resolve('./target/test-project');

console.log('*** ' + pathToRepo);

module.exports = {
    beforeEach: function (browser, done) {
        git.createRepo('./src/test/resources/multibranch_1', pathToRepo)
            .then(function() {
                git.createBranch('feature/1', pathToRepo)
                    .then(done);
            });
    },

    'Create Multbranch Job': function (browser) {
        const branchCreate = browser.page.multibranchCreate().navigate();
        branchCreate.createBranch('multiBranch', pathToRepo);
        browser.end();
    }
};