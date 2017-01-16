/** @module folder
 * @memberof multibranch
 * @description
 *
 * Tests: Tests specific to MBP in folders
 *
 * REGRESSION covered:
 *
 * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-39842|JENKINS-39842} - Open Blue Ocean button should not try to load /activity for a folder
 *
 */
const git = require("../../../main/js/api/git");
const path = require("path");
const pageHelper = require("../../../main/js/util/pageHelper");
const sanityCheck = pageHelper.sanityCheck;

// base configuration for the path of the folders
const projectFolderPath = ['aFolder', 'bFolder', 'cFolder'];
//  our job should be named the same way in both folders
const jobName = 'MBPInFolderTree';
// git repo details
const pathToRepo = path.resolve('./target/test-project-folder');
const soureRep = './src/test/resources/multibranch_1';

module.exports = {
    /**
     * creating a git repo
     */
    before: function (browser, done) {
        browser.waitForJobDeleted('aFolder', function () {
            // we creating a git repo in target based on the src repo (see above)
            git.createRepo(soureRep, pathToRepo)
                .then(function () {
                    git.createBranch('feature/1', pathToRepo)
                        .then(done);
                });
        });
    },
    /**
     * Create folder structure - "aFolder/bFolder/cFolder"
     */
    'step 01': function (browser) {
        // Initial folder create page
        const folderCreate = browser.page.folderCreate().navigate();
        // create nested folder for the project
        folderCreate.createFolders(projectFolderPath);
    },
    /**
     * Create multibranch job - "MBPInFolderTree"
     */
    'step 02': function (browser) {
        // go to the newItem page
        browser.page.jobUtils().newItem();
        // and then use the multibranchCreate page object to create
        // a multibranch project
        browser.page.multibranchCreate().createBranch(jobName, pathToRepo);
    },
    /**
     * test open blueocean from classic - run details
     * @param browser
     */
    'step 03': function(browser) {
        var classicRunPage = browser.page.classicRun();

        classicRunPage.navigateToRun('aFolder/job/bFolder/job/cFolder/job/MBPInFolderTree/job/master');

        // make sure the open blue ocean button works. In this case,
        // it should bring the browser to the run details page for the first run.
        browser.openBlueOcean();
        browser.url(function (response) {
           sanityCheck(browser, response);
           response.value.endsWith('/blue/organizations/jenkins/aFolder%2FbFolder%2FcFolder%2FMBPInFolderTree/branches/');

            // Make sure the page has all the bits and bobs
            // See JENKINS-40137
            const blueRunDetailPage = browser.page.bluePipelineRunDetail();
            blueRunDetailPage.assertBasicLayoutOkay();
        });
    },
    /**
     * test open blueocean from classic - a normal folder page in classic jenkins.
     * <p>
     * It should send the user to the top level blue ocean page (pipelines).
     * @param browser
     */
    'step 04': function(browser) {
        var classicGeneral = browser.page.classicGeneral();

        // Go to a folder along the path to the MBP, but one
        // of the parent folders i.e. not the MBP project folder.
        classicGeneral.navigateToRun('job/aFolder/job/bFolder');

        // make sure the open blue ocean button works. In this case,
        // it should bring the browser to the main top-level pipelines page.
        // See https://issues.jenkins-ci.org/browse/JENKINS-39842
        browser.openBlueOcean();
        browser.url(function (response) {
            sanityCheck(browser, response);
            response.value.endsWith('/blue/pipelines');

            // Make sure the page has all the bits and bobs
            // See JENKINS-40137
            const bluePipelines = browser.page.bluePipelines();
            bluePipelines.assertBasicLayoutOkay();
        });
    },
};
