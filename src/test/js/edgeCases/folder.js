const git = require("../../../main/js/api/git");
const path = require("path");
const fse = require('fs-extra');
const async = require("async");

// base configuration for the path of the folders
const folders = ['firstFolder', '三百', 'ñba', '七'];
const anotherFolders = ['anotherFolder', '三百', 'ñba', '七'];
//  our job should be named the same way in both folders
const jobName = 'Sohn';
// git repo details
const pathToRepo = path.resolve('./target/test-project-folder');
const soureRep = './src/test/resources/multibranch_1';
// helper to return the project name including a seperator or '/'
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

        // we creating a git repo in target based on the src repo (see above)
        git.createRepo(soureRep, pathToRepo)
            .then(function () {
                git.createBranch('feature/1', pathToRepo)
                    .then(done);
            });
    },

    'Create folder and then a freestyle job - "firstFolder"': function (browser) {
        // Initial folder create page
        const folderCreate = browser.page.folderCreate().navigate();
        // create nested folder for the project
        folderCreate.createFolders(browser, folders);
        // create the freestyle job in the folder
        folderCreate.createFreestyle(browser, folders.join('/'), jobName, 'freestyle.sh');
    },

    // JENKINS-36618 part 1 - create same job but in another folder
    'Create folder and then a multibranch job - "anotherFolder"': function (browser) {
        // Initial folder create page
        const folderCreate = browser.page.folderCreate().navigate();
        // create nested folder for the project
        folderCreate.createFolders(browser, anotherFolders);
        // go to the multibranch creation page
        const branchCreate = browser.page.multibranchCreate().forJob(anotherFolders.join('/'));
        // Let us create a multibranch object in the nested folders
        branchCreate.createBranch(jobName, pathToRepo, anotherFolders.slice().shift());
    },

    // JENKINS-36618 part 2 - verify
    'Jobs can have the same name in different folders, they should show up in the gui': function (browser) {
        const bluePipelinesPage = browser.page.bluePipelines().navigate();
        // simply validate that the pipline listing is showing the basic things
        bluePipelinesPage.assertBasicLayoutOkay();
        // by now we should have 2 different jobs from prior steps
        bluePipelinesPage.countJobToBeEqual(browser, jobName, 2);
    },

    'Build freestyle job': function (browser) {
        const freestyleJob = browser.page.jobUtils()
            .forJob(getProjectName(folders));
        // start a build on the nested freestyle project
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
            // if we have changed the url then we should have now firstFolder in the path
            browser.assert.equal(response.value.indexOf('firstFolder') > -1, true);
        })
    },

    'Validate correct encoding, pipeline graph and steps': function (browser) {
        // /JENKINS-36616 - Unable to load multibranch projects in a folder
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // JENKINS-36773 / JENKINS-37605 verify encoding and spacing of details
        blueRunDetailPage.assertTitle('jenkins / ' + anotherFolders.join(' / ') + ' / feature/1');
        // FIXME JENKINS-36619 -> somehow the close in AT is not working
        // blueRunDetailPage.closeModal(browser);
        // JENKINS-36613 Unable to load steps for multibranch pipelines with / in them
        blueRunDetailPage.validateGraph(); // test whether we have a pipeline graph
        blueRunDetailPage.validateSteps(browser); // validate that steps are displayed
        // There should be no authors
        blueRunDetailPage.authorsIsNotSet(browser);
    },

    'Check whether the artifacts tab shows artifacts': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // go to the artifact page by clicking the tab
        blueRunDetailPage.clickTab(browser, 'artifacts');
        // we have added 2 files as artifact
        blueRunDetailPage.validateNotEmptyArtifacts(browser, 2);
    },

    // JENKINS-36674 Tests are not being reported
    'Check whether the test tab shows failing tests': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // Go to the test page by clicking the tab
        blueRunDetailPage.clickTab(browser, 'tests');
        // There should be failing tests
        blueRunDetailPage.validateFailingTests();
    },

    'Check whether the changes tab shows changes - one commit': function (browser) {
        // magic number
        const magic = 1;
        // creating an array
        const committs = Array.from(new Array(magic), function (x, i) {
            return i;
        });
        // now we have to index the branch, it is important that we create the page out of the asyncSeries
        const masterJob = browser.page.jobUtils()
            .forJob(getProjectName(anotherFolders), '/indexing');
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
            console.log('Now starting the indexing', results.length, 'commits recorded')
            // start a new build by starting indexing
            masterJob.indexingStarted();
            // test whether we have commit
            const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 2);
            // click on the changes tab
            blueRunDetailPage.clickTab(browser, 'changes');
            // we should have one commits now
            blueRunDetailPage.validateNotEmptyChanges(browser);
            // the author title should be shown
            blueRunDetailPage.authorsIsNotCondensed(browser);
            // Wait for the job to end
            blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');
        });
    },

    // JENKINS-36615 the multibranch project has the branch 'feature/1'
    'Jobs can be started from branch tab. - RUN': function (browser) {
        // first get the activity screen for the project
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(projectName, 'jenkins');
        // validate that we have 3 activities from the previous tests
        blueActivityPage.assertActivitiesToBeEqual(browser, 3);
        // change to the branch page, clicking on the tab
        blueActivityPage.clickTab(browser, 'branches');
        // click on the first matching run button (small one)
        browser.page.bluePipelineBranch().clickRunButton(browser);
        // go to the detail page
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 2);
        // Wait for the job to end
        blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/feature%2F1');
    },

    'Check whether the changes tab shows changes - condensed': function (browser) {
        // magic number of how many commits we want to create
        const magic = 15;
        // creating an array
        const committs = Array.from(new Array(magic), function (x, i) {
            return i;
        });
        // now we have to index the branch, it is important that we create the page out of the asyncSeries
        const masterJob = browser.page.jobUtils()
            .forJob(getProjectName(anotherFolders), '/indexing');
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
                        console.log('commitId', commitId);
                        /* We are sure that all async functions have finished.
                         * Now we let async know about it by
                         * callback without error and the commitId
                         */
                        callback(null, commitId);
                    })
            });

        }, function(err, results) {
            // results is an array of names
            console.log('Now starting the indexing', results.length, 'commits recorded')
            // start a new build by starting indexing
            masterJob.indexingStarted();
            // test whether we have commit
            const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 3);
            // click on the changes tab
            blueRunDetailPage.clickTab(browser, 'changes');
            // we should have a couple of commits now
            blueRunDetailPage.validateNotEmptyChanges(browser);
            // make sure the windows is small
            browser.resizeWindow(1000, 600);
            // test now whether the authors are not listed but condendes
            blueRunDetailPage.authorsIsCondensed(browser);
            // make the browser big again
            browser.resizeWindow(1680, 1050);
            // Wait for the job to end
            blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');
        });
    },
};
