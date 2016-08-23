const jobName = 'Sohn';
module.exports = {
    'Create folder Job "firstFolder"': function (browser) {
        const folderCreate = browser.page.folderCreate().navigate();
        folderCreate.createFolder(browser, 'firstFolder', ['三百', 'ñba', '七']);
        folderCreate.createFreestyle(browser, jobName, 'freestyle.sh');
    },

    'Build folder Job': function (browser) {
        browser.url(function (response) {
            const freestylePage = browser.page.pipeline()
                .forUrl(response.value, jobName);

            freestylePage.buildStarted(function () {
                // Reload the job page and check that there was a build done.
                freestylePage
                    .forRun(1)
                    .waitForElementVisible('@executer');
            })
        })
    },

};
