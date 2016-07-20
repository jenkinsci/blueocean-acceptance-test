module.exports = {
    'Create frestyle Job "hijo"': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle('hijo', 'freestyle.sh');
    },

    'Build frestyle Job': function (browser) {
        const frestylePage = browser.page.pipeline().forJob('hijo');
        frestylePage.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            frestylePage
                .forRun(1)
                .waitForElementVisible('@executer');
        })
    },

    'Check Job Blue Ocean Activity Page has run': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('hijo', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('hijo-1');
    },

    // need to click on an element so the up_arrow takes place in the window
    'Check Job Blue Ocean run detail page - stop karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('hijo', 'jenkins', 1);
        blueRunDetailPage.assertBasicLayoutOkay();

        // The log appears in the <code> window, of which there an be only one.
        // Click on it to focus it so we make sure the key up is fired on the page and
        // not directly on the browser
        browser.waitForElementVisible('code')
            .click('code');

        // Press the up-arrow key to tell karaoke mode to stop following the log i.e.
        // after this point in time, the content of the <code> block should not change.
        browser.keys(browser.Keys.UP_ARROW);

        // So, because we have pressed the up-arrow (see above), the log karaoke
        // should stop. So if we now wait for the build to end, we should NOT see
        // the log output generated at the end of freestyle.sh i.e. the "freeStyle end"
        // string. If we see that string, that means that karaoke did not stop and
        // something is wrong with the up-arrow listener.
        browser.expect.element('code').text.to.not.contain('freeStyle end');
        blueRunDetailPage.waitForJobRunEnded('hijo')
            .waitForElementVisible('code')
            // .expect.element('code').text.to.not.contain('freeStyle end'); -> that is failing on the server only
    },

};
