const git = require('../../main/js/api/git');
const path = require("path");

const pathToRepo = path.resolve('./target/test-project');
const multiBranchJob = 'multiBranch';
console.log('*** ' + pathToRepo);

module.exports = {
    before: function (browser, done) {
        git.createRepo('./src/test/resources/multibranch_1', pathToRepo)
            .then(function() {
                git.createBranch('feature/1', pathToRepo)
                    .then(done);
            });
    },

    'Test queued jobs - disable executors': function (browser) {
        const configure = browser.page.computer().navigate();
        configure.setNumber(browser, 0);
        // now testing queued jobs
        // first starting a freestyle
    },
    //
    // 'Create Multbranch Job': function (browser) {
    //     const branchCreate = browser.page.multibranchCreate().navigate();
    //     branchCreate.createBranch(multiBranchJob, pathToRepo); //-> if we start the job we have to wait for the finish
    // },
    //
    //
    // 'Validate queued state on job': function (browser) {
    //     const blueRunDetailPage = browser.page.bluePipelineRunDetail()
    //         .forRun(multiBranchJob, 'jenkins', 'feature%2F1', 1);
    //     blueRunDetailPage.validateEmpty();
    // },

    'Test queued jobs - enable executors': function (browser) {
        const configure = browser.page.computer().navigate();
        // now let us reset the executors again
        configure.setNumber(browser, 2);
    },
    //
    // 'Validate logConsole state on job': function (browser) {
    //     const blueRunDetailPage = browser.page.bluePipelineRunDetail()
    //         .forRun(multiBranchJob, 'jenkins', 'feature%2F1', 1);
    //     blueRunDetailPage.validateGraph();
    // },
};