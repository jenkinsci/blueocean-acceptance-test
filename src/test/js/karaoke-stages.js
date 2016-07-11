module.exports = {
    'Create Pipeline Job "stages"': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline('stages', 'stages-with-wait.groovy', function () {
            browser.end();
        });
    },

    'Build Pipeline Job': function (browser) {
        const pipelinePage = browser.page.pipeline().forJob('stages');
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
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('stages', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('stages-1');
    },
    // need to click on an element so the up_arrow takes place in the window
    'Check Job Blue Ocean Pipeline run detail page - stop karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
        browser.waitForElementVisible('code')
            .click('code')
            .keys(browser.Keys.UP_ARROW)
            .getText('code', function (result) {
                const text = result.value;
                // we wait and see whether no more updates come through
                this.pause(10)
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.equal(text, result.value);
                    });

            });
        blueRunDetailPage.assertBasicLayoutOkay();

        browser.end();
    },

    'Check Job Blue Ocean Pipeline run detail page - karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
        blueRunDetailPage.waitForElementVisible('code')
            .getText('code', function (result) {
                const text = result.value;
                //node change
                this.waitForElementPresent('svg circle.success')
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.notEqual(text, result.value)
                    })
                ;
            })
        ;
        // FIXME should be taken from somewhere dinamically
        const nodeDetail =  blueRunDetailPage.forNode('5');
        nodeDetail.waitForElementVisible('div.result-item')
            .getText('div.result-item', function (result) {
                this.assert.equal('Shell Script', result.value);
            })
        ;
        // test whether the expand works
        nodeDetail.waitForElementVisible('div.result-item')
            .click('div.result-item')
            .waitForElementVisible('code')
            .getText('code', function (result) {
                this.assert.notEqual(null, result.value);
            });
        browser.end();
    }
};
