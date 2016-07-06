module.exports = {
    'Create Pipeline Job "stages"': function (browser) {
        var pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline('stages', 'stages-with-wait.groovy', function () {
            browser.end();
        });
    },

    'Build Pipeline Job': function (browser) {
        var pipelinePage = browser.page.pipeline().forJob('stages');
        pipelinePage.build()
            .waitForElementVisible('div#pipeline-box')
            .forRun(1)
            .waitForElementVisible('@executer');
    },

    'Check Job Blue Ocean Pipeline Activity Page has run': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('stages', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('stages-1');
    },

    'Check Job Blue Ocean Pipeline run detail page - stop follow': function (browser) {
        var blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
        browser.waitForElementVisible('code')
            .keys(browser.Keys.UP_ARROW)
            .getText('code', function (result) {
                var text = result.value;
                this.pause(1000)
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.equal(text, result.value)
                    });

            });
        blueRunDetailPage.assertBasicLayoutOkay();

        browser.end();
    },

    'Check Job Blue Ocean Pipeline run detail page - follow': function (browser) {
        var blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
        browser.waitForElementVisible('code')
            .getText('code', function (result) {
                var text = result.value;
                this.pause(5000)
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.notEqual(text, result.value)
                    });
            });
        blueRunDetailPage.assertBasicLayoutOkay();

        browser.end();
    }
};
