const async = require("async");
const stringCleaner = function (string) {
  return string.replace(/\r?\n|\r/g, '');
};
// using different syntax of the same pipeline
const cases = [{
    name: 'stagesClassic',
    script: 'stages-with-wait.groovy',
    nodeId: '5',
},{
    name: 'stagesBlock',
    script: 'stages-with-wait-block-syntax.groovy',
    nodeId: '6',
},{
    name: 'stagesPM',
    script: 'stages-with-wait-pipelineModel-syntax.groovy',
    nodeId: '6',
},];
/*
 Create a callback wrapper - we need to make sure that we have finished before
 we use the callback. If we have an error we invoke with error.
 @param callback, the callback we need to call
 */
const createCallbackWrapper = function (callback) {
    return function callbackWrapper(status) {
        if (status && status.state) {
            callback(null, status);
        } else {
            callback(new Error(status))
        }
    };
};
module.exports = {
    'Create Pipeline Job "stages"': function (browser) {
        // create the different jobs
        async.mapSeries(cases, function (useCase, callback) {
            console.log('creating pipeline job', useCase.name, useCase.script);
            // navigate to the create page
            const pipelinesCreate = browser.page.pipelineCreate().navigate();
            pipelinesCreate
                .createPipeline(useCase.name, useCase.script, createCallbackWrapper(callback))
            ;
        });
    },

    'Build Pipeline Job': function (browser) {
        // we need to create a browser page outside the async loop
        // const pipelinesCreate = browser.page.pipelineCreate().navigate();
        async.mapSeries(cases, function (useCase, callback) {
            const pipelinePage = browser.page.jobUtils().forJob(useCase.name);
            pipelinePage.buildStarted(function() {
                // Reload the job page and check that there was a build done.
                pipelinePage
                    .waitForElementVisible('div#pipeline-box')
                    .forRun(1)
                    .waitForElementVisible('@executer', createCallbackWrapper(callback));
            });
        });
    },

    'Check Job Blue Ocean Pipeline Activity Page has run': function (browser) {
        async.mapSeries(cases, function (useCase, callback) {
            const blueActivityPage = browser.page.bluePipelineActivity().forJob(useCase.name, 'jenkins');
            // Check the run itself
            blueActivityPage.waitForRunRunningVisible(useCase.name + '-1', createCallbackWrapper(callback));
        });
    },

    'Check Job Blue Ocean Pipeline run detail page - karaoke': function (browser) {
        // this test case tests a live pipeline that is why we only running it with one case
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(cases[0].name, 'jenkins', 1);
        blueRunDetailPage.assertBasicLayoutOkay();
        // if we have the first stage finished we are sure in karaoke mode
        blueRunDetailPage.waitForElementPresent('svg circle.success');
        // FIXME should be taken from somewhere dynamically
        // Stop karaoke and go back in graph and see the result
        const nodeDetail = blueRunDetailPage.forNode(cases[0].nodeId);
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
        nodeDetail.waitForJobRunEnded(cases[0].name);
    },

    'Check whether there is an EmptyStateView for stages with no steps': function (browser) {
        async.mapSeries(cases, function (useCase, callback) {
            // the pipeline-model cannot have "noSteps" need to skip the test for that
            if (useCase.name !== "stagesPM") {
                const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(useCase.name, 'jenkins', 1);
                blueRunDetailPage.waitForElementVisible('@emptystate', createCallbackWrapper(callback));
            } else {
                callback(null);
            }
        });
    },

    'Check whether the artifacts tab shows artifacts': function (browser) {
        async.mapSeries(cases, function (useCase, callback) {
            const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(useCase.name, 'jenkins', 1);
            blueRunDetailPage.clickTab(browser, 'artifacts');
            blueRunDetailPage
                .validateNotEmptyArtifacts(browser, 1)
                .waitForElementVisible('@artifactTable', createCallbackWrapper(callback));
        }, function(err, results) {
            // Check whether the changes tab shows emptyState for only one case
            // this test case is the finisher since we cannot finish with a async series without a closing func
            const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(cases[0].name, 'jenkins', 1);
            blueRunDetailPage.clickTab(browser, 'changes');
            blueRunDetailPage.waitForElementVisible('@emptystate');
        });
    },
};
