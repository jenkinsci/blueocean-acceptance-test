const jobName = 'ping';
module.exports = {
    'Create freestyle Job "ping"': function (browser) {
        const freestyleCreate = browser.page.freestyleCreate().navigate();
        freestyleCreate.createFreestyle(jobName, 'freestylePing.sh');
    },

    'Build freestyle Job': function (browser) {
        const freestylePage = browser.page.jobUtils().forJob(jobName);
        freestylePage.buildStarted(function () {
            // Reload the job page and check that there was a build done.
            freestylePage
                .forRun(1)
                .waitForElementVisible('@executer');
        })
    },

    'Check Job Blue Ocean run detail page - karaoke': function (browser) {
        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(jobName, 'jenkins', 1);

        browser.resizeWindow(600, 600);
        blueRunDetailPage.waitForJobRunEnded(jobName)
            .waitForElementVisible('code')
            .fullLogButtonNotPresent()
            .expect.element('code').text.to.contain('Finished: SUCCESS');
        // make sure the windows is small
        browser.execute(function (selector) {
            const cmElem = document.evaluate(
                    selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue;
            // return the scrollHeight to determine whether we moved to the bottom on karaoke
            return cmElem.scrollHeight;
        }, ['//div[@class="content"]'], function (result) {
            browser.assert.equal(typeof result, "object");
            browser.assert.equal(result.status, 0);
            browser.assert.equal(result.value > 0, true);
        });
        // make the browser big again
        browser.resizeWindow(1680, 1050);

    },


};
