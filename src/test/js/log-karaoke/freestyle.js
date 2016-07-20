module.exports = {
    'Create frestyle Job "hijo"': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle('hijo', 'freestyle.sh', function () {
            browser.end();
        });
    },

    'Build frestyle Job': function (browser) {
        const frestylePage = browser.page.pipeline().forJob('hijo');
        frestylePage.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            frestylePage
                .forRun(1)
                .waitForElementVisible('@executer');
            browser.end();
        })
    },

    'Check Job Blue Ocean Activity Page has run': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('hijo', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('hijo-1');
        browser.end();
    },
    // need to click on an element so the up_arrow takes place in the window
    'Check Job Blue Ocean run detail page - stop karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('hijo', 'jenkins', 1);
        blueRunDetailPage.assertBasicLayoutOkay();
        browser.waitForElementVisible('code')
            .click('code')
            .keys(browser.Keys.UP_ARROW)
            .getText('code', function (result) {
                const text = result.value;
                // we wait and see whether no more updates come through
                this.pause(3000)
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.equal(text, result.value);
                    });
            });
        // wait for the success update via sse event
        blueRunDetailPage.waitForElementVisible('div.header.success');
        browser.end();
    },

};
