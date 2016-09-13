/** @module folder
 * @memberof edgeCases
 * @description
 *
 * Tests: Condensed state of commit author in detail header
 *
 * REGRESSION covered:
 *
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36618|JENKINS-36618} - create same job but in another folder
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36616|JENKINS-36616} - Unable to load multibranch projects in a folder
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36773|JENKINS-36773} / {@link https://issues.jenkins-ci.org/browse/JENKINS-37605|JENKINS-37605} verify encoding and spacing of details
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36613|JENKINS-36613} Unable to load steps for multibranch pipelines with / in them
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36674|JENKINS-36674} Tests are not being reported
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36615|JENKINS-36615} the multibranch project has the branch 'feature/1'
 *
 *
 */
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
// ** creating a git repo */
    before: function (browser, done) {

        // we creating a git repo in target based on the src repo (see above)
        git.createRepo(soureRep, pathToRepo)
            .then(function () {
                git.createBranch('feature/1', pathToRepo)
                    .then(done);
            });
    },
/** Create folder and then a freestyle job - "firstFolder"*/
    'step 01': function (browser) {
        // Initial folder create page
        const folderCreate = browser.page.folderCreate().navigate();
        // create nested folder for the project
        folderCreate.createFolders(folders);
        // create the freestyle job in the folder
        folderCreate.createFreestyle(folders.join('/'), jobName, 'freestyle.sh');
    },
/** Create folder and then a multibranch job - "anotherFolder"
 *
 * @see  {@link https://issues.jenkins-ci.org/browse/JENKINS-36618|JENKINS-36618} part 1 - create same job but in another folder*/
    'step 02': function (browser) {
        // Initial folder create page
        const folderCreate = browser.page.folderCreate().navigate();
        // create nested folder for the project
        folderCreate.createFolders(anotherFolders);
        // go to the multibranch creation page
        const branchCreate = browser.page.multibranchCreate().newItem(anotherFolders.join('/'));
        // Let us create a multibranch object in the nested folders
        branchCreate.createBranch(jobName, pathToRepo);
    },
/** Jobs can have the same name in different folders, they should show up in the gui
 *
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36618|JENKINS-36618} part 2 - verify*/
    'step 03': function (browser) {
        const bluePipelinesPage = browser.page.bluePipelines().navigate();
        // simply validate that the pipline listing is showing the basic things
        bluePipelinesPage.assertBasicLayoutOkay();
        // by now we should have 2 different jobs from prior steps
        bluePipelinesPage.countJobToBeEqual(browser, jobName, 2);
    },
/** Build freestyle job */
    'step 04': function (browser) {
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
/** Validate correct encoding, pipeline graph and steps */
    'step 05': function (browser) {
        // /JENKINS-36616 - Unable to load multibranch projects in a folder
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // {@link https://issues.jenkins-ci.org/browse/JENKINS-36773|JENKINS-36773} / JENKINS-37605 verify encoding and spacing of details
        blueRunDetailPage.assertTitle('jenkins / ' + anotherFolders.join(' / ') + ' / feature/1');
        // FIXME JENKINS-36619 -> somehow the close in AT is not working
        // blueRunDetailPage.closeModal();
        // JENKINS-36613 Unable to load steps for multibranch pipelines with / in them
        blueRunDetailPage.validateGraph(); // test whether we have a pipeline graph
        blueRunDetailPage.validateSteps(); // validate that steps are displayed
        // There should be no authors
        blueRunDetailPage.authorsIsNotSet();
    },
/** Check whether the artifacts tab shows artifacts*/
    'step 06': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // go to the artifact page by clicking the tab
        blueRunDetailPage.clickTab('artifacts');
        // we have added 2 files as artifact
        blueRunDetailPage.validateNotEmptyArtifacts(2);
    },
/** Check whether the test tab shows failing tests
 *
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36674|JENKINS-36674} Tests are not being reported */
    'step 07': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);
        // Go to the test page by clicking the tab
        blueRunDetailPage.clickTab('tests');
        // There should be failing tests
        blueRunDetailPage.validateFailingTests();
    },
/** Check whether the changes tab shows changes - one commit*/
    'step 08': function (browser) {
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
            blueRunDetailPage.clickTab('changes');
            // we should have one commits now
            blueRunDetailPage.validateNotEmptyChanges();
            // the author title should be shown
            blueRunDetailPage.authorsIsNotCondensed();
            // Wait for the job to end
            blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');
        });
    },
/** Jobs can be started from branch tab. - RUN
 *
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36615|JENKINS-36615} the multibranch project has the branch 'feature/1' */
    'step 09': function (browser) {
        // first get the activity screen for the project
        const blueActivityPage = browser.page.bluePipelineActivity().forJob(projectName, 'jenkins');
        // validate that we have 3 activities from the previous tests
        blueActivityPage.assertActivitiesToBeEqual(3);
        // change to the branch page, clicking on the tab
        blueActivityPage.clickTab('branches');
        // click on the first matching run button (small one)
        browser.page.bluePipelineBranch().clickRunButton();
        // go to the detail page
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 2);
        // Wait for the job to end
        blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/feature%2F1');
    },
/** Check whether the changes tab shows changes - condensed*/
    'step 10': function (browser) {
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
            blueRunDetailPage.clickTab('changes');
            // we should have a couple of commits now
            blueRunDetailPage.validateNotEmptyChanges();
            // make sure the windows is small
            browser.resizeWindow(1000, 600);
            // test now whether the authors are not listed but condendes
            blueRunDetailPage.authorsIsCondensed();
            // make the browser big again
            browser.resizeWindow(1680, 1050);
            // Wait for the job to end
            blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');
        });
    },
};
