const stringCleaner = function (string) {
  return string.replace(/\r?\n|\r/g, '');
};
module.exports = {
    'Create Pipeline Job "stages"': function (browser) {
        const pipelinesCreate = browser.page.pipelineCreate().navigate();
        pipelinesCreate.createPipeline('stages', 'stages-with-wait.groovy');
    },

    'Build Pipeline Job': function (browser) {
        const pipelinePage = browser.page.jobUtils().forJob('stages');
        pipelinePage.buildStarted(function() {
            // Reload the job page and check that there was a build done.
            pipelinePage
                .waitForElementVisible('div#pipeline-box')
                .forRun(1)
                .waitForElementVisible('@executer');
        });
    },

    'Check Job Blue Ocean Pipeline Activity Page has run': function (browser) {
        const blueActivityPage = browser.page.bluePipelineActivity().forJob('stages', 'jenkins');
        // Check the run itself
        blueActivityPage.waitForRunRunningVisible('stages-1');
    },

    'Check Job Blue Ocean Pipeline run detail page - karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
        blueRunDetailPage.assertBasicLayoutOkay();
        // if we have the first stage finished we are sure in karaoke mode
        blueRunDetailPage.waitForElementPresent('svg circle.success');
        // FIXME should be taken from somewhere dynamically
        // Stop karaoke and go back in graph and see the result
        const nodeDetail =  blueRunDetailPage.forNode('5');
        // validate that karaoke has stopped but overall process still runs
        nodeDetail.waitForElementVisible('g.progress-spinner.running');
        // Validate the result of the node
        nodeDetail.waitForElementVisible('span.result-item-label')
            .getText('span.result-item-label', function (result) {
                this.assert.equal('Shell Script', result.value);
            })
        ;
        // test whether the expand works
        nodeDetail.clickFirstResultItem();
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
        nodeDetail.waitForJobRunEnded('stages');
    },

    'Check whether there is an EmptyStateView for stages with no steps': function (browser) {
       const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
       blueRunDetailPage.waitForElementVisible('div.empty-state');
    },

    'Check whether the artifacts tab shows artifacts': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun('stages', 'jenkins', 1);
        blueRunDetailPage.clickTab(browser, 'artifacts');
        blueRunDetailPage.validateNotEmptyArtifacts();
    }
};
