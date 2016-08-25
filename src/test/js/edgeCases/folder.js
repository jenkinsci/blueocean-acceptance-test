const git = require("../../../main/js/api/git");
const path = require("path");
var fse = require('fs-extra');

const folders = ['firstFolder', '三百', 'ñba', '七'];
const anotherFolders = ['anotherFolder', '三百', 'ñba', '七'];
const jobName = 'Sohn';

const pathToRepo = path.resolve('./target/test-project-folder');

function getProjectName(nameArray, seperator) {
    if (!seperator) {
        seperator = '/';
    }
    return nameArray.join(seperator) + seperator + jobName;
}

// here we need to escape the real projectName to a urlEncoded string
const projectName = getProjectName(anotherFolders, '%2F');

console.log('*** ', pathToRepo, 'jobName', jobName);

module.exports = {

    before: function (browser, done) {
        git.createRepo('./src/test/resources/multibranch_1', pathToRepo)
            .then(function () {
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

    // JENKINS-36618 part 2 - verify
    'Jobs can have the same name in different folders, they should show up in the gui': function (browser) {
        const bluePipelinesPage = browser.page.bluePipelines().navigate();
        bluePipelinesPage.assertBasicLayoutOkay();
        bluePipelinesPage.countJobToBeEqual(browser, jobName, 2);
    },

    'Build freestyle job': function (browser) {
        const freestyleJob = browser.page.jobUtils()
            .forJob(getProjectName(folders));

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

    'Jobs can have the same name in different folders, they should show up in the gui': function (browser) {
        // /JENKINS-36616 - Unable to load multibranch projects in a folder
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // JENKINS-36773 / JENKINS-37605 verify encoding and spacing of details
        blueRunDetailPage.assertTitle('jenkins / ' + anotherFolders.join(' / ') + ' / feature/1');
        // FIXME JENKINS-36619 -> somehow the close in AT is not working
        //blueRunDetailPage.closeModal(browser);
        // JENKINS-36613 Unable to load steps for multibranch pipelines with / in them
        blueRunDetailPage.validateGraph();
        blueRunDetailPage.validateSteps(browser);
    },

    'Check whether the artifacts tab shows artifacts': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        blueRunDetailPage.clickTab(browser, 'artifacts');
        blueRunDetailPage.validateNotEmptyArtifacts(browser, 2);
    },

    'Check whether the test tab shows failing tests': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        blueRunDetailPage.clickTab(browser, 'tests');
        blueRunDetailPage.validateFailingTests();
    },

    'Check whether the changes tab shows changes': function (browser) {
        // create new files and a commit
        fse.writeFile(path.join(pathToRepo, '666.txt'), '666');
        git.createCommit(pathToRepo, ['666.txt']);
        // now we have to index the branch
        const masterJob = browser.page.jobUtils()
            .forJob(getProjectName(anotherFolders), '/indexing');
        // start a new build by starting indexing
        masterJob.indexingStarted();
        // test whether we have commit
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 2);
        blueRunDetailPage.clickTab(browser, 'changes');
        blueRunDetailPage.validateNotEmptyChanges(browser, 1);
    },

    // JENKINS-36615 the multibranch project has the branch 'feature/1'
    'Jobs can be started from branch tab. - RUN': function (browser) {
    },

    // NEXT JENKINS-36619 JENKINS-36674 ...
};
