const git = require("../../../main/js/api/git");
const path = require("path");

const folders = ['firstFolder', '三百', 'ñba', '七'];
const anotherFolders = ['anotherFolder', '三百', 'ñba', '七'];
const jobName = 'Sohn';

const pathToRepo = path.resolve('./target/test-project-folder');

console.log('*** ', pathToRepo, 'jobName', jobName);

module.exports = {

    before: function (browser, done) {
        git.createRepo('./src/test/resources/multibranch_1', pathToRepo)
            .then(function() {
                git.createBranch('feature/1', pathToRepo)
                    .then(done);
            });
    },

    'Create folder and then a freestyle job - "firstFolder"': function (browser) {
        const folderCreate = browser.page.folderCreate().navigate();
        folderCreate.createFolders(browser, folders);
        folderCreate.createFreestyle(browser, folders.join('/'), jobName, 'freestyle.sh');
    },

    // JENKINS-36618 part 1 - create same job but in another folder
    'Create folder and then a multibranch job - "anotherFolder"': function (browser) {
        const folderCreate = browser.page.folderCreate().navigate();
        folderCreate.createFolders(browser, anotherFolders);
        const branchCreate = browser.page.multibranchCreate().forJob(anotherFolders.join('/'));
        branchCreate.createBranch(jobName, pathToRepo, anotherFolders.slice().shift());
    },

    'Build freestyle job': function (browser) {
        const freestyleJob = browser.page.jobUtils()
            .forJob('firstFolder/三百/ñba/七/' + jobName);

        freestyleJob.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            freestyleJob
                .forRun(1)
                .waitForElementVisible('@executer');
        });
        // See whether we have changed the url
        browser.url(function (response) {
            browser.assert.equal(typeof response, "object");
            browser.assert.equal(response.status, 0);
            browser.assert.equal(response.value.indexOf('firstFolder') > -1, true);
        })
    },

    // JENKINS-36618 part 2 - verify
    'Jobs can have the same name in different folders, they should show up in the gui': function (browser) {
        var bluePipelinesPage = browser.page.bluePipelines().navigate();

        bluePipelinesPage.assertBasicLayoutOkay();
        bluePipelinesPage.countJobToBeEqual(browser, jobName, 2);
    },

};
