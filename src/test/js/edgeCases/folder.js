const git = require("../../../main/js/api/git");
const path = require("path");
const fse = require('fs-extra');
const async = require("async");

const folders = ['firstFolder', '三百', 'ñba', '七'];
const anotherFolders = ['anotherFolder', '三百', 'ñba', '七'];
const jobName = 'Sohn';

const pathToRepo = path.resolve('./target/test-project-folder');
const soureRep = './src/test/resources/multibranch_1';

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

        git.createRepo(soureRep, pathToRepo)
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

    'Validate correct encoding, pipeline graph and steps': function (browser) {
        // /JENKINS-36616 - Unable to load multibranch projects in a folder
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // JENKINS-36773 / JENKINS-37605 verify encoding and spacing of details
        blueRunDetailPage.assertTitle('jenkins / ' + anotherFolders.join(' / ') + ' / feature/1');
        // FIXME JENKINS-36619 -> somehow the close in AT is not working
        //blueRunDetailPage.closeModal(browser);
        // JENKINS-36613 Unable to load steps for multibranch pipelines with / in them
        blueRunDetailPage.validateGraph();
        blueRunDetailPage.validateSteps(browser);
        // There should be no authors
        blueRunDetailPage.authorsIsNotSet(browser);
    },

    'Check whether the artifacts tab shows artifacts': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        blueRunDetailPage.clickTab(browser, 'artifacts');
        blueRunDetailPage.validateNotEmptyArtifacts(browser, 2);
    },

    // JENKINS-36674 Tests are not being reported
    'Check whether the test tab shows failing tests': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        blueRunDetailPage.clickTab(browser, 'tests');
        blueRunDetailPage.validateFailingTests();
    },

    'Check whether the changes tab shows changes - one commit': function (browser) {
        // magic number
        const magic = 1;
        // creating an array
        const committs = Array.from(new Array(magic), function (x, i) {
            return i;
        });
        var recordedCommits = 0;
        // creating commits from that array with a mapSeries -> not parallel
        async.mapSeries(committs, function (file, callback) {
            const filename = file + '.txt';
            // writeFile is async so we need to use callback
            fse.writeFile(path.join(pathToRepo, filename), file, function (err) {
                // when we get an error we call with error
                if (err) {
                    callback(err);
                }
                // createCommit returns a promise just passing it alone
                return git.createCommit(pathToRepo, [filename])
                    .then(function (commitId) {
                        // if we reached here we have a commit
                        console.log('commitId', commitId)
                        /* We are sure that all async functions have finished.
                         * Now we let async know about it by
                         * callback without error and the commitId
                         */
                        callback(null, commitId);
                    })
            });

        }, function(err, results) {
            // results is an array of names
            recordedCommits = results.length;
            console.log(results.length, 'commits recorded')
        });
        console.log('Now starting the indexing', recordedCommits)
        // now we have to index the branch
        const masterJob = browser.page.jobUtils()
            .forJob(getProjectName(anotherFolders), '/indexing');
        // start a new build by starting indexing
        masterJob.indexingStarted();
        // test whether we have commit
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 2);
        blueRunDetailPage.clickTab(browser, 'changes');
        blueRunDetailPage.validateNotEmptyChanges(browser);
        blueRunDetailPage.authorsIsNotCondensed(browser);
    },

    'Check whether the changes tab shows changes - condensed': function (browser) {
        // magic number
        const magic = 15;
        // creating an array
        const committs = Array.from(new Array(magic), function (x, i) {
            return i;
        });
        var recordedCommits = 0;
        // creating commits from that array with a mapSeries -> not parallel
        async.mapSeries(committs, function (file, callback) {
            const filename = file + '.txt';
            // writeFile is async so we need to use callback
            fse.writeFile(path.join(pathToRepo, filename), file, function (err) {
                // when we get an error we call with error
                if (err) {
                    callback(err);
                }
                // createCommit returns a promise just passing it alone
                return git.createCommit(pathToRepo, [filename])
                    .then(function (commitId) {
                        // if we reached here we have a commit
                        console.log('commitId', commitId)
                        /* We are sure that all async functions have finished.
                         * Now we let async know about it by
                         * callback without error and the commitId
                         */
                        callback(null, commitId);
                    })
            });

        }, function(err, results) {
            // results is an array of names
            recordedCommits = results.length;
            console.log(results.length, 'commits recorded')
        });
        console.log('Now starting the indexing', recordedCommits)
        // now we have to index the branch
        const masterJob = browser.page.jobUtils()
            .forJob(getProjectName(anotherFolders), '/indexing');
        // start a new build by starting indexing
        masterJob.indexingStarted();
        // test whether we have commit
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 3);
        blueRunDetailPage.clickTab(browser, 'changes');
        blueRunDetailPage.validateNotEmptyChanges(browser);
        blueRunDetailPage.authorsIsCondensed(browser);
    },

    // JENKINS-36615 the multibranch project has the branch 'feature/1'
    'Jobs can be started from branch tab. - RUN': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(projectName, 'jenkins');
        blueActivityPage.assertActivitiesToBeEqual(browser, 4);
        blueActivityPage.clickTab(browser, 'branches');
        browser.page.bluePipelineBranch().clickRunButton(browser);
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 2);
        blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/feature%2F1');
    },

};
