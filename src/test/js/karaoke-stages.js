const stringCleaner = function (string) {
  return string.replace(/\r?\n|\r/g, '');
};
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
                const text = stringCleaner(result.value);
                // we wait and see whether no more updates come through
                this.pause(10)
                    .waitForElementVisible('code')
                    .getText('code', function (result) {
                        this.assert.equal(text, stringCleaner(result.value));
                    });

            });
        blueRunDetailPage.assertBasicLayoutOkay();

        browser.end();
    },

    'Check Job Blue Ocean Pipeline run detail page - karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
        // if we have the first stage finished we are sure in karaoke mode
        blueRunDetailPage.waitForElementPresent('svg circle.success');
        // FIXME should be taken from somewhere dynamically
        const nodeDetail =  blueRunDetailPage.forNode('5');
        nodeDetail.waitForElementVisible('span.result-item-label')
            .getText('span.result-item-label', function (result) {
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
        // test whether the stage we seeing is highlighted
        nodeDetail.waitForElementVisible('g.pipeline-node-selected');
        // test whether log lines are navigatable
        // first turn on xpath to get the nodes we want
        browser.useXpath();
        var aXpath = '//code/p/a[1]';
        nodeDetail
            .waitForElementVisible(aXpath)
            .getAttribute(aXpath, 'href', function (result) {
                this.assert.equal(typeof result, "object");
                this.assert.equal(result.status, 0);
                const value = result.value;
                this
                    .click(aXpath)
                    .url(function (response) {
                        // did we changed the url on  change?
                        this.assert.equal(response.value, result.value);
                        // controll whether we can still see the log and the link is still the same
                        this.waitForElementVisible(aXpath)
                            .getAttribute(aXpath, 'href', function (inner) {
                                this.assert.equal(inner.value, result.value);
                            })
                    })

            });
        // turn on css again
        browser.useCss();
        // wait for job to finish
        nodeDetail.waitForElementVisible('div.header.success');
        browser.end();
    }
};
