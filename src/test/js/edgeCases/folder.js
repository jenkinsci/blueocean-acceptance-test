const jobName = 'Sohn';
module.exports = {
    'Create folder Job "firstFolder"': function (browser) {
        const folderCreate = browser.page.folderCreate().navigate();
        folderCreate.createFolder(browser, 'firstFolder', ['三百', 'ñba', '七']);
        folderCreate.createFreestyle(browser, jobName, 'freestyle.sh');
        // JENKINS-36618 part 1 - create same job but in another folder
        const folderCreate2 = browser.page.folderCreate().navigate();
        folderCreate2.createFolder(browser, 'anotherFolder', ['三百', 'ñba', '七']);
        folderCreate2.createFreestyle(browser, jobName, 'freestyle.sh');
    },

    'Build folder Job': function (browser) {
        browser.url(function (response) {
            const freestylePage = browser.page.pipeline()
                .forUrl(response.value, jobName);

            // freestylePage.buildStarted(function () {
            //     // Reload the job page and check that there was a build done.
            //     freestylePage
            //         .forRun(1)
            //         .waitForElementVisible('@executer');
            // })
        })
    },

    // JENKINS-36618 part 2 - verify
    'Jobs can have the same name in different folders, they should show up in the gui': function (browser) {
        var bluePipelinesPage = browser.page.bluePipelines().navigate();

        bluePipelinesPage.assertBasicLayoutOkay();
        bluePipelinesPage.countJobToBeEqual(browser, jobName, 2);
    },

};
