module.exports = {
    'Create Pipeline Job "noStages"': function (browser) {
        var pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline('noStages', 'no-stages.groovy', function () {
            browser.end();
        });
    },

    'Build Pipeline Job': function (browser) {
        var pipelinePage = browser.page.pipeline().forJob('noStages');
        pipelinePage.buildStarted(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage
                .waitForElementVisible('div#pipeline-box')
                .forRun(1)
                .waitForElementVisible('@executer');
            browser.end();
        });
    },

    'Check Job Blue Ocean Pipeline Activity Page has run': function (browser) {
        var blueActivityPage = browser.page.bluePipelineActivity().forJob('noStages', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('noStages-1');
    },

    'Check Job Blue Ocean Pipeline run detail page - stop follow': function (browser) {
        var blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('noStages', 'jenkins', 1);
        browser.waitForElementVisible('code')
            .click('code')
            .keys(browser.Keys.UP_ARROW)
            .getText('code', function (result) {
                var text = result.value;
                this.pause(10000)
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.equal(text, result.value)
                    });

            });
        blueRunDetailPage.assertBasicLayoutOkay();

        browser.end();
    },

    'Check Job Blue Ocean Pipeline run detail page - follow': function (browser) {
        var blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('noStages', 'jenkins', 1);
        browser.waitForElementVisible('code')
            .getText('code', function (result) {
                var text = result.value;
                this.pause(10000)
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.notEqual(text, result.value)
                    });
            });
        blueRunDetailPage.assertBasicLayoutOkay();

        browser.end();
    }
};
