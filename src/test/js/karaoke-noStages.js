module.exports = {
    'Create Pipeline Job "noStages"': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline('noStages', 'no-stages.groovy', function () {
            browser.end();
        });
    },

    'Build Pipeline Job': function (browser) {
        const pipelinePage = browser.page.pipeline().forJob('noStages');
        pipelinePage.buildStarted(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage
                .waitForElementVisible('div#pipeline-box')
                .forRun(1)
                .waitForElementVisible('@executer');
            browser.end();
        });
    },

    'Check Job Blue Ocean Pipeline Activity Page has run  - stop follow': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('noStages', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('noStages-1');
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('noStages', 'jenkins', 1);
        browser.waitForElementVisible('code')
            .click('code')
            .keys(browser.Keys.UP_ARROW)
            .getText('code', function (result) {
                const text = result.value;
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
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('noStages', 'jenkins', 1);
        browser.elements('css selector', 'div.result-item.success', function (collection) {
            const count = collection.value.length;
            // wait for the success update via sse event
            this.waitForElementVisible('div.header.success')
                .elements('css selector', 'div.result-item.success', function (collection2) {
                    const count2 = collection2.value.length;
                    this.assert.notEqual(count, count2);
                });
        });
        browser.end();
    }
};
