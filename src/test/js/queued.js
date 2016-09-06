const git = require('../../main/js/api/git');
const path = require("path");

const pathToRepo = path.resolve('./target/test-project');
const multiBranchJob = 'multiBranch';
const jobNameFreestyle = 'Eleven';
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

    'Create Multbranch Job': function (browser) {
        const branchCreate = browser.page.multibranchCreate().navigate();
        branchCreate.createBranch(multiBranchJob, pathToRepo); //-> if we start the job we have to wait for the finish
    },

    'Create freestyle job "Eleven"': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle(jobNameFreestyle, 'freestyle.sh');
    },

    'Queue for build freestyle job': function (browser) {
        const freestylePage = browser.page.jobUtils().forJob(jobNameFreestyle);
        freestylePage.buildQueued();
    },
    // FIXME: Disabled because of https://issues.jenkins-ci.org/browse/JENKINS-37843
    // to enable remove ! before function
    'Validate queued state on freestyle job': !function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail()
            .forRun(jobNameFreestyle, 'jenkins', 1);
        blueRunDetailPage.validateQueued();
    },

    'Validate queued state on multibranch job': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail()
            .forRun(multiBranchJob, 'jenkins', 'feature%2F1', 1);
        blueRunDetailPage.validateQueued();
    },

    'Test queued jobs - enable executors': function (browser) {
        const configure = browser.page.computer().navigate();
        // now let us reset the executors again
        configure.setNumber(browser, 2);
    },

    'Validate graph on multibranch job': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail()
            .forRun(multiBranchJob, 'jenkins', 'feature%2F1', 1);
        blueRunDetailPage.validateGraph();
    },
    // FIXME: Disabled because of https://issues.jenkins-ci.org/browse/JENKINS-37843
    // to enable remove ! before function
    'Validate logConsole on freestyle job': !function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail()
            .forRun(jobNameFreestyle, 'jenkins', 1);
        blueRunDetailPage.validateLog();
        blueRunDetailPage.waitForJobRunEnded(jobNameFreestyle);
    },
};