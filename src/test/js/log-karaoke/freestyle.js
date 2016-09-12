/** @module freestyle
 * @memberof karaoke
 * @description TEST: logs tailing with a freestyle job - karaoke mode
 */
module.exports = {
/** Create freestyle Job "hijo"*/
    'Step 01': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle('hijo', 'freestyle.sh');
    },
/** Build freestyle Job*/
    'Step 02': function (browser) {
        const freestylePage = browser.page.jobUtils().forJob('hijo');
        freestylePage.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            freestylePage
                .forRun(1)
                .waitForElementVisible('@executer');
        })
    },
/** Check Job Blue Ocean Activity Page has run*/
    'Step 03': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('hijo', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('hijo-1');
    },
/** Check Job Blue Ocean run detail page - karaoke*/
    'Step 04': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('hijo', 'jenkins', 1);
        // assert basic page style
        blueRunDetailPage.assertBasicLayoutOkay();

        blueRunDetailPage.waitForJobRunEnded('hijo')
            .waitForElementVisible('code')
            .fullLogButtonNotPresent()
            .expect.element('code').text.to.contain('freeStyle end');// this produces a long wait by big logs
    },
/** Check whether a log which exceed 150kb contains a link to full log and if clicked it disappear*/
    'Step 05': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('hijo', 'jenkins', 1);
        // request full log
        blueRunDetailPage.clickFullLog();
    },

};
