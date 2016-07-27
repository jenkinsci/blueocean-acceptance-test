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

    'Check Job Blue Ocean run detail page - karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('hijo', 'jenkins', 1);
        // assert basic page style
        blueRunDetailPage.assertBasicLayoutOkay();

        blueRunDetailPage.waitForJobRunEnded('hijo')
            .waitForElementVisible('code')
            .expect.element('code').text.to.contain('freeStyle end');
    },

    'Check whether a log which exceed 150kb contains a link to full log and if clicked it disappear': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('hijo', 'jenkins', 1);
        const path = 'p#log-0 a';
        blueRunDetailPage
            .waitForElementVisible(path);
        // request full log
        browser.click(path)
            .url(function (response) {
                this.assert.equal(typeof response, "object");
                this.assert.equal(response.status, 0);
                // is the "full log" link gone?
                this.expect.element(path).to.not.be.present.before(1000);
                // did we changed the url on  change?
                this.assert.equal(response.value.includes('start=0'), true);
            })
    },

};
