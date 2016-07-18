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
            .elements('css selector', 'div.result-item', function (resutlItems) {
                var results = resutlItems.value.length;
                // to validate that we left follow, give it some time and then count the elements again
                this.pause(3000)
                    .elements('css selector', 'code', function (codeCollection) {
                        // JENKINS-36700 there can only be one code view open in follow stopped
                        this.assert.equal(codeCollection.value.length, 1);
                    })
                    .elements('css selector', 'div.result-item', function (resutlItemsCompare) {
                        // there should not be more items then we had before
                        this.assert.equal( resutlItemsCompare.value.length, results);
                    })
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
                })
                .elements('css selector', 'code', function (codeCollection) {
                    // JENKINS-36700 in success all code should be closed,
                    // however if the browser is too quick there can still be one open
                    this.assert.equal(codeCollection.value.length < 2, true);
                })
            ;
        });
        browser.end();
    }
};
