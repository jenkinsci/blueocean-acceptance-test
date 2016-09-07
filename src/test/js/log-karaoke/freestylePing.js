const jobName = 'ping';
module.exports = {
    'Create freestyle Job "ping"': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle(jobName, 'freestylePing.sh');
    },

    'Build freestyle Job': function (browser) {
        const freestylePage = browser.page.jobUtils().forJob(jobName);
        freestylePage.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            freestylePage
                .forRun(1)
                .waitForElementVisible('@executer');
        })
    },

    'Check Job Blue Ocean run detail page - karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 1);

        browser.resizeWindow(600, 600);
        blueRunDetailPage.waitForJobRunEnded(jobName)
            .waitForElementVisible('code')
            .fullLogButtonNotPresent()
            .expect.element('code').text.to.contain('Finished: SUCCESS');
        // make sure the windows is small
        blueRunDetailPage.validateScrollToBottom();
        // make the browser big again
        browser.resizeWindow(1680, 1050);

    },


};
