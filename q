[1mdiff --git a/src/test/js/edgeCases/folder.js b/src/test/js/edgeCases/folder.js[m
[1mindex 47c8204..ccdba37 100644[m
[1m--- a/src/test/js/edgeCases/folder.js[m
[1m+++ b/src/test/js/edgeCases/folder.js[m
[36m@@ -48,223 +48,229 @@[m [mmodule.exports = {[m
     // Strangely, it works on Thorstens machine. Tried upgrading git version. Tried on[m
     // MacOS and on Ubuntu 16.[m
     //[m
[31m-    //// ** creating a git repo */[m
[31m-    //before: function (browser, done) {[m
[31m-    //[m
[31m-    //    // we creating a git repo in target based on the src repo (see above)[m
[31m-    //    git.createRepo(soureRep, pathToRepo)[m
[31m-    //        .then(function () {[m
[31m-    //            git.createBranch('feature/1', pathToRepo)[m
[31m-    //                .then(done);[m
[31m-    //        });[m
[31m-    //},[m
[31m-    ///** Create folder and then a freestyle job - "firstFolder"*/[m
[31m-    //'step 01': function (browser) {[m
[31m-    //    // Initial folder create page[m
[31m-    //    const folderCreate = browser.page.folderCreate().navigate();[m
[31m-    //    // create nested folder for the project[m
[31m-    //    folderCreate.createFolders(folders);[m
[31m-    //    // create the freestyle job in the folder[m
[31m-    //    folderCreate.createFreestyle(folders.join('/'), jobName, 'freestyle.sh');[m
[31m-    //},[m
[31m-    ///** Create folder and then a multibranch job - "anotherFolder"[m
[31m-    // *[m
[31m-    // * @see  {@link https://issues.jenkins-ci.org/browse/JENKINS-36618|JENKINS-36618} part 1 - create same job but in another folder[m
[31m-    // */[m
[31m-    //'step 02': function (browser) {[m
[31m-    //    // Initial folder create page[m
[31m-    //    const folderCreate = browser.page.folderCreate().navigate();[m
[31m-    //    // create nested folder for the project[m
[31m-    //    folderCreate.createFolders(anotherFolders);[m
[31m-    //    // go to the multibranch creation page[m
[31m-    //    const branchCreate = browser.page.multibranchCreate().newItem(anotherFolders.join('/'));[m
[31m-    //    // Let us create a multibranch object in the nested folders[m
[31m-    //    branchCreate.createBranch(jobName, pathToRepo);[m
[31m-    //},[m
[31m-    ///** Jobs can have the same name in different folders, they should show up in the gui[m
[31m-    // *[m
[31m-    // * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36618|JENKINS-36618} part 2 - verify[m
[31m-    // */[m
[31m-    //'step 03': function (browser) {[m
[31m-    //    const bluePipelinesPage = browser.page.bluePipelines().navigate();[m
[31m-    //    // simply validate that the pipline listing is showing the basic things[m
[31m-    //    bluePipelinesPage.assertBasicLayoutOkay();[m
[31m-    //    // by now we should have 2 different jobs from prior steps[m
[31m-    //    bluePipelinesPage.countJobToBeEqual(browser, jobName, 2);[m
[31m-    //},[m
[31m-    ///** Build freestyle job */[m
[31m-    //'step 04': function (browser) {[m
[31m-    //    const freestyleJob = browser.page.jobUtils()[m
[31m-    //        .forJob(getProjectName(folders));[m
[31m-    //    // start a build on the nested freestyle project[m
[31m-    //    freestyleJob.buildStarted(function () {[m
[31m-    //        // Reload the job page and check that there was a build done.[m
[31m-    //        freestyleJob[m
[31m-    //            .forRun(1)[m
[31m-    //            .waitForElementVisible('@executer');[m
[31m-    //    });[m
[31m-    //    // See whether we have changed the url[m
[31m-    //    browser.url(function (response) {[m
[31m-    //        browser.assert.equal(typeof response, "object");[m
[31m-    //        browser.assert.equal(response.status, 0);[m
[31m-    //        // if we have changed the url then we should have now firstFolder in the path[m
[31m-    //        browser.assert.equal(response.value.indexOf('firstFolder') > -1, true);[m
[31m-    //    })[m
[31m-    //},[m
[31m-    ///** Validate correct encoding, pipeline graph and steps */[m
[31m-    //'step 05': function (browser) {[m
[31m-    //    // /JENKINS-36616 - Unable to load multibranch projects in a folder[m
[31m-    //    const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);[m
[31m-    //    // {@link https://issues.jenkins-ci.org/browse/JENKINS-36773|JENKINS-36773} / JENKINS-37605 verify encoding and spacing of details[m
[31m-    //    blueRunDetailPage.assertTitle('jenkins / ' + anotherFolders.join(' / ') + ' / feature/1');[m
[31m-    //    // FIXME JENKINS-36619 -> somehow the close in AT is not working[m
[31m-    //    // blueRunDetailPage.closeModal();[m
[31m-    //    // JENKINS-36613 Unable to load steps for multibranch pipelines with / in them[m
[31m-    //    blueRunDetailPage.validateGraph(); // test whether we have a pipeline graph[m
[31m-    //    blueRunDetailPage.validateSteps(); // validate that steps are displayed[m
[31m-    //    // There should be no authors[m
[31m-    //    blueRunDetailPage.authorsIsNotSet();[m
[31m-    //},[m
[31m-    ///** Check whether the artifacts tab shows artifacts*/[m
[31m-    //'step 06': function (browser) {[m
[31m-    //    const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);[m
[31m-    //    // go to the artifact page by clicking the tab[m
[31m-    //    blueRunDetailPage.clickTab('artifacts');[m
[31m-    //    // we have added 2 files as artifact[m
[31m-    //    blueRunDetailPage.validateNotEmptyArtifacts(2);[m
[31m-    //},[m
[31m-    ///** Check whether the test tab shows failing tests[m
[31m-    // *[m
[31m-    // * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36674|JENKINS-36674} Tests are not being reported[m
[31m-    // */[m
[31m-    //'step 07': function (browser) {[m
[31m-    //    const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);[m
[31m-    //    // Go to the test page by clicking the tab[m
[31m-    //    blueRunDetailPage.clickTab('tests');[m
[31m-    //    // There should be failing tests[m
[31m-    //    blueRunDetailPage.validateFailingTests();[m
[31m-    //},[m
[31m-    ///** Check whether the changes tab shows changes - one commit*/[m
[31m-    //'step 08': function (browser) {[m
[31m-    //    // magic number[m
[31m-    //    const magic = 1;[m
[31m-    //    // creating an array[m
[31m-    //    const committs = Array.from(new Array(magic), function (x, i) {[m
[31m-    //        return i;[m
[31m-    //    });[m
[31m-    //    // now we have to index the branch, it is important that we create the page out of the asyncSeries[m
[31m-    //    const masterJob = browser.page.jobUtils()[m
[31m-    //        .forJob(getProjectName(anotherFolders), '/indexing');[m
[31m-    //    var recordedCommits = 0;[m
[31m-    //    // creating commits from that array with a mapSeries -> not parallel[m
[31m-    //    async.mapSeries(committs, function (file, callback) {[m
[31m-    //        const filename = file + '.txt';[m
[31m-    //        // writeFile is async so we need to use callback[m
[31m-    //        fse.writeFile(path.join(pathToRepo, filename), file, function (err) {[m
[31m-    //            // when we get an error we call with error[m
[31m-    //            if (err) {[m
[31m-    //                callback(err);[m
[31m-    //            }[m
[31m-    //            // createCommit returns a promise just passing it alone[m
[31m-    //            return git.createCommit(pathToRepo, [filename])[m
[31m-    //                .then(function (commitId) {[m
[31m-    //                    // if we reached here we have a commit[m
[31m-    //                    console.log('commitId', commitId)[m
[31m-    //                    /* We are sure that all async functions have finished.[m
[31m-    //                     * Now we let async know about it by[m
[31m-    //                     * callback without error and the commitId[m
[31m-    //                     */[m
[31m-    //                    callback(null, commitId);[m
[31m-    //                })[m
[31m-    //        });[m
[31m-    //[m
[31m-    //    }, function(err, results) {[m
[31m-    //        // results is an array of names[m
[31m-    //        console.log('Now starting the indexing', results.length, 'commits recorded')[m
[31m-    //        // start a new build by starting indexing[m
[31m-    //        masterJob.indexingStarted();[m
[31m-    //        // test whether we have commit[m
[31m-    //        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 2);[m
[31m-    //        // click on the changes tab[m
[31m-    //        blueRunDetailPage.clickTab('changes');[m
[31m-    //        // we should have one commits now[m
[31m-    //        blueRunDetailPage.validateNotEmptyChanges();[m
[31m-    //        // the author title should be shown[m
[31m-    //        blueRunDetailPage.authorsIsNotCondensed();[m
[31m-    //        // Wait for the job to end[m
[31m-    //        blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');[m
[31m-    //    });[m
[31m-    //},[m
[31m-    ///** Jobs can be started from branch tab. - RUN[m
[31m-    // *[m
[31m-    // * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36615|JENKINS-36615} the multibranch project has the branch 'feature/1'[m
[31m-    // */[m
[31m-    //'step 09': function (browser) {[m
[31m-    //    // first get the activity screen for the project[m
[31m-    //    const blueActivityPage = browser.page.bluePipelineActivity().forJob(projectName, 'jenkins');[m
[31m-    //    // validate that we have 3 activities from the previous tests[m
[31m-    //    blueActivityPage.assertActivitiesToBeEqual(3);[m
[31m-    //    // change to the branch page, clicking on the tab[m
[31m-    //    blueActivityPage.clickTab('branches');[m
[31m-    //    // click on the first matching run button (small one)[m
[31m-    //    browser.page.bluePipelineBranch().clickRunButton();[m
[31m-    //    // go to the detail page[m
[31m-    //    const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 2);[m
[31m-    //    // Wait for the job to end[m
[31m-    //    blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/feature%2F1');[m
[31m-    //},[m
[31m-    ///** Check whether the changes tab shows changes - condensed*/[m
[31m-    //'step 10': function (browser) {[m
[31m-    //    // magic number of how many commits we want to create[m
[31m-    //    const magic = 15;[m
[31m-    //    // creating an array[m
[31m-    //    const committs = Array.from(new Array(magic), function (x, i) {[m
[31m-    //        return i;[m
[31m-    //    });[m
[31m-    //    // now we have to index the branch, it is important that we create the page out of the asyncSeries[m
[31m-    //    const masterJob = browser.page.jobUtils()[m
[31m-    //        .forJob(getProjectName(anotherFolders), '/indexing');[m
[31m-    //    // creating commits from that array with a mapSeries -> not parallel[m
[31m-    //    async.mapSeries(committs, function (file, callback) {[m
[31m-    //        const filename = file + '.txt';[m
[31m-    //        // writeFile is async so we need to use callback[m
[31m-    //        fse.writeFile(path.join(pathToRepo, filename), file, function (err) {[m
[31m-    //            // when we get an error we call with error[m
[31m-    //            if (err) {[m
[31m-    //                callback(err);[m
[31m-    //            }[m
[31m-    //            // createCommit returns a promise just passing it alone[m
[31m-    //            return git.createCommit(pathToRepo, [filename])[m
[31m-    //                .then(function (commitId) {[m
[31m-    //                    // if we reached here we have a commit[m
[31m-    //                    console.log('commitId', commitId);[m
[31m-    //                    /* We are sure that all async functions have finished.[m
[31m-    //                     * Now we let async know about it by[m
[31m-    //                     * callback without error and the commitId[m
[31m-    //                     */[m
[31m-    //                    callback(null, commitId);[m
[31m-    //                })[m
[31m-    //        });[m
[31m-    //[m
[31m-    //    }, function(err, results) {[m
[31m-    //        // results is an array of names[m
[31m-    //        console.log('Now starting the indexing', results.length, 'commits recorded')[m
[31m-    //        // start a new build by starting indexing[m
[31m-    //        masterJob.indexingStarted();[m
[31m-    //        // test whether we have commit[m
[31m-    //        const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 3);[m
[31m-    //        // click on the changes tab[m
[31m-    //        blueRunDetailPage.clickTab('changes');[m
[31m-    //        // we should have a couple of commits now[m
[31m-    //        blueRunDetailPage.validateNotEmptyChanges();[m
[31m-    //        // make sure the windows is small[m
[31m-    //        browser.resizeWindow(1000, 600);[m
[31m-    //        // test now whether the authors are not listed but condendes[m
[31m-    //        blueRunDetailPage.authorsIsCondensed();[m
[31m-    //        // make the browser big again[m
[31m-    //        browser.resizeWindow(1680, 1050);[m
[31m-    //        // Wait for the job to end[m
[31m-    //        blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');[m
[31m-    //    });[m
[31m-    //},[m
[32m+[m[32m    // ** creating a git repo */[m
[32m+[m[32m    before: function (browser, done) {[m
[32m+[m
[32m+[m[32m       // we creating a git repo in target based on the src repo (see above)[m
[32m+[m[32m       git.createRepo(soureRep, pathToRepo)[m
[32m+[m[32m           .then(function () {[m
[32m+[m[32m               git.createBranch('feature/1', pathToRepo)[m
[32m+[m[32m                   .then(done);[m
[32m+[m[32m           });[m
[32m+[m[32m    },[m
[32m+[m[32m    /** Create folder and then a freestyle job - "firstFolder"*/[m
[32m+[m[32m    'step 01': function (browser) {[m
[32m+[m[32m       // Initial folder create page[m
[32m+[m[32m       const folderCreate = browser.page.folderCreate().navigate();[m
[32m+[m[32m       // create nested folder for the project[m
[32m+[m[32m       folderCreate.createFolders(folders);[m
[32m+[m[32m       // create the freestyle job in the folder[m
[32m+[m[32m       folderCreate.createFreestyle(folders.join('/'), jobName, 'freestyle.sh');[m
[32m+[m[32m    },[m
[32m+[m[32m    /** Create folder and then a multibranch job - "anotherFolder"[m
[32m+[m[32m    *[m
[32m+[m[32m    * @see  {@link https://issues.jenkins-ci.org/browse/JENKINS-36618|JENKINS-36618} part 1 - create same job but in another folder[m
[32m+[m[32m    */[m
[32m+[m[32m    'step 02': function (browser) {[m
[32m+[m[32m       // Initial folder create page[m
[32m+[m[32m       const folderCreate = browser.page.folderCreate().navigate();[m
[32m+[m[32m       // create nested folder for the project[m
[32m+[m[32m       folderCreate.createFolders(anotherFolders);[m
[32m+[m[32m       // go to the multibranch creation page[m
[32m+[m[32m       const branchCreate = browser.page.multibranchCreate().newItem(anotherFolders.join('/'));[m
[32m+[m[32m       // Let us create a multibranch object in the nested folders[m
[32m+[m[32m       branchCreate.createBranch(jobName, pathToRepo);[m
[32m+[m[32m    },[m
[32m+[m[32m    /** Jobs can have the same name in different folders, they should show up in the gui[m
[32m+[m[32m    *[m
[32m+[m[32m    * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36618|JENKINS-36618} part 2 - verify[m
[32m+[m[32m    */[m
[32m+[m[32m    'step 03': function (browser) {[m
[32m+[m[32m       const bluePipelinesPage = browser.page.bluePipelines().navigate();[m
[32m+[m[32m       // simply validate that the pipline listing is showing the basic things[m
[32m+[m[32m       bluePipelinesPage.assertBasicLayoutOkay();[m
[32m+[m[32m       // by now we should have 2 different jobs from prior steps[m
[32m+[m[32m       bluePipelinesPage.countJobToBeEqual(browser, jobName, 2);[m
[32m+[m[32m    },[m
[32m+[m[32m    /** Build freestyle job */[m
[32m+[m[32m    'step 04': function (browser) {[m
[32m+[m[32m       const freestyleJob = browser.page.jobUtils()[m
[32m+[m[32m           .forJob(getProjectName(folders));[m
[32m+[m[32m       // start a build on the nested freestyle project[m
[32m+[m[32m       freestyleJob.buildStarted(function () {[m
[32m+[m[32m           // Reload the job page and check that there was a build done.[m
[32m+[m[32m           freestyleJob[m
[32m+[m[32m               .forRun(1)[m
[32m+[m[32m               .waitForElementVisible('@executer');[m
[32m+[m[32m       });[m
[32m+[m[32m       // See whether we have changed the url[m
[32m+[m[32m       browser.url(function (response) {[m
[32m+[m[32m           browser.assert.equal(typeof response, "object");[m
[32m+[m[32m           browser.assert.equal(response.status, 0);[m
[32m+[m[32m           // if we have changed the url then we should have now firstFolder in the path[m
[32m+[m[32m           browser.assert.equal(response.value.indexOf('firstFolder') > -1, true);[m
[32m+[m[32m       })[m
[32m+[m[32m    },[m
[32m+[m[32m    //FIXME the test is disabled due to https://cloudbees.atlassian.net/browse/OSS-1438[m
[32m+[m[32m    /** Validate correct encoding, pipeline graph and steps */[m
[32m+[m[32m    'step 05': !function (browser) {[m
[32m+[m[32m       // /JENKINS-36616 - Unable to load multibranch projects in a folder[m
[32m+[m[32m       const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);[m
[32m+[m[32m       // {@link https://issues.jenkins-ci.org/browse/JENKINS-36773|JENKINS-36773} / JENKINS-37605 verify encoding and spacing of details[m
[32m+[m[32m       blueRunDetailPage.assertTitle('jenkins / ' + anotherFolders.join(' / ') + ' / feature/1');[m
[32m+[m[32m       // FIXME JENKINS-36619 -> somehow the close in AT is not working[m
[32m+[m[32m       // blueRunDetailPage.closeModal();[m
[32m+[m[32m       // JENKINS-36613 Unable to load steps for multibranch pipelines with / in them[m
[32m+[m[32m       blueRunDetailPage.validateGraph(); // test whether we have a pipeline graph[m
[32m+[m[32m       blueRunDetailPage.validateSteps(); // validate that steps are displayed[m
[32m+[m[32m       // There should be no authors[m
[32m+[m[32m       blueRunDetailPage.authorsIsNotSet();[m
[32m+[m[32m    },[m
[32m+[m[32m    //FIXME the test is disabled due to https://cloudbees.atlassian.net/browse/OSS-1438[m
[32m+[m[32m    /** Check whether the artifacts tab shows artifacts*/[m
[32m+[m[32m    'step 06': !function (browser) {[m
[32m+[m[32m       const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);[m
[32m+[m[32m       // go to the artifact page by clicking the tab[m
[32m+[m[32m       blueRunDetailPage.clickTab('artifacts');[m
[32m+[m[32m       // we have added 2 files as artifact[m
[32m+[m[32m       blueRunDetailPage.validateNotEmptyArtifacts(2);[m
[32m+[m[32m    },[m
[32m+[m[32m    //FIXME the test is disabled due to https://cloudbees.atlassian.net/browse/OSS-1438[m
[32m+[m[32m    /** Check whether the test tab shows failing tests[m
[32m+[m[32m    *[m
[32m+[m[32m    * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36674|JENKINS-36674} Tests are not being reported[m
[32m+[m[32m    */[m
[32m+[m[32m    'step 07': !function (browser) {[m
[32m+[m[32m       const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 1);[m
[32m+[m[32m       // Go to the test page by clicking the tab[m
[32m+[m[32m       blueRunDetailPage.clickTab('tests');[m
[32m+[m[32m       // There should be failing tests[m
[32m+[m[32m       blueRunDetailPage.validateFailingTests();[m
[32m+[m[32m    },[m
[32m+[m[32m    //FIXME the test is disabled due to https://cloudbees.atlassian.net/browse/OSS-1438[m
[32m+[m[32m    /** Check whether the changes tab shows changes - one commit*/[m
[32m+[m[32m    'step 08': !function (browser) {[m
[32m+[m[32m       // magic number[m
[32m+[m[32m       const magic = 1;[m
[32m+[m[32m       // creating an array[m
[32m+[m[32m       const committs = Array.from(new Array(magic), function (x, i) {[m
[32m+[m[32m           return i;[m
[32m+[m[32m       });[m
[32m+[m[32m       // now we have to index the branch, it is important that we create the page out of the asyncSeries[m
[32m+[m[32m       const masterJob = browser.page.jobUtils()[m
[32m+[m[32m           .forJob(getProjectName(anotherFolders), '/indexing');[m
[32m+[m[32m       var recordedCommits = 0;[m
[32m+[m[32m       // creating commits from that array with a mapSeries -> not parallel[m
[32m+[m[32m       async.mapSeries(committs, function (file, callback) {[m
[32m+[m[32m           const filename = file + '.txt';[m
[32m+[m[32m           // writeFile is async so we need to use callback[m
[32m+[m[32m           fse.writeFile(path.join(pathToRepo, filename), file, function (err) {[m
[32m+[m[32m               // when we get an error we call with error[m
[32m+[m[32m               if (err) {[m
[32m+[m[32m                   callback(err);[m
[32m+[m[32m               }[m
[32m+[m[32m               // createCommit returns a promise just passing it alone[m
[32m+[m[32m               return git.createCommit(pathToRepo, [filename])[m
[32m+[m[32m                   .then(function (commitId) {[m
[32m+[m[32m                       // if we reached here we have a commit[m
[32m+[m[32m                       console.log('commitId', commitId)[m
[32m+[m[32m                       /* We are sure that all async functions have finished.[m
[32m+[m[32m                        * Now we let async know about it by[m
[32m+[m[32m                        * callback without error and the commitId[m
[32m+[m[32m                        */[m
[32m+[m[32m                       callback(null, commitId);[m
[32m+[m[32m                   })[m
[32m+[m[32m           });[m
[32m+[m
[32m+[m[32m       }, function(err, results) {[m
[32m+[m[32m           // results is an array of names[m
[32m+[m[32m           console.log('Now starting the indexing', results.length, 'commits recorded')[m
[32m+[m[32m           // start a new build by starting indexing[m
[32m+[m[32m           masterJob.indexingStarted();[m
[32m+[m[32m           // test whether we have commit[m
[32m+[m[32m           const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 2);[m
[32m+[m[32m           // click on the changes tab[m
[32m+[m[32m           blueRunDetailPage.clickTab('changes');[m
[32m+[m[32m           // we should have one commits now[m
[32m+[m[32m           blueRunDetailPage.validateNotEmptyChanges();[m
[32m+[m[32m           // the author title should be shown[m
[32m+[m[32m           blueRunDetailPage.authorsIsNotCondensed();[m
[32m+[m[32m           // Wait for the job to end[m
[32m+[m[32m           blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');[m
[32m+[m[32m       });[m
[32m+[m[32m    },[m
[32m+[m[32m    //FIXME the test is disabled due to https://cloudbees.atlassian.net/browse/OSS-1438[m
[32m+[m[32m    /** Jobs can be started from branch tab. - RUN[m
[32m+[m[32m    *[m
[32m+[m[32m    * @see {@link https://issues.jenkins-ci.org/browse/JENKINS-36615|JENKINS-36615} the multibranch project has the branch 'feature/1'[m
[32m+[m[32m    */[m
[32m+[m[32m    'step 09': !function (browser) {[m
[32m+[m[32m       // first get the activity screen for the project[m
[32m+[m[32m       const blueActivityPage = browser.page.bluePipelineActivity().forJob(projectName, 'jenkins');[m
[32m+[m[32m       // validate that we have 3 activities from the previous tests[m
[32m+[m[32m       blueActivityPage.assertActivitiesToBeEqual(3);[m
[32m+[m[32m       // change to the branch page, clicking on the tab[m
[32m+[m[32m       blueActivityPage.clickTab('branches');[m
[32m+[m[32m       // click on the first matching run button (small one)[m
[32m+[m[32m       browser.page.bluePipelineBranch().clickRunButton();[m
[32m+[m[32m       // go to the detail page[m
[32m+[m[32m       const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'feature%2F1', 2);[m
[32m+[m[32m       // Wait for the job to end[m
[32m+[m[32m       blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/feature%2F1');[m
[32m+[m[32m    },[m
[32m+[m[32m    //FIXME the test is disabled due to https://cloudbees.atlassian.net/browse/OSS-1438[m
[32m+[m[32m    /** Check whether the changes tab shows changes - condensed*/[m
[32m+[m[32m    'step 10': !function (browser) {[m
[32m+[m[32m       // magic number of how many commits we want to create[m
[32m+[m[32m       const magic = 15;[m
[32m+[m[32m       // creating an array[m
[32m+[m[32m       const committs = Array.from(new Array(magic), function (x, i) {[m
[32m+[m[32m           return i;[m
[32m+[m[32m       });[m
[32m+[m[32m       // now we have to index the branch, it is important that we create the page out of the asyncSeries[m
[32m+[m[32m       const masterJob = browser.page.jobUtils()[m
[32m+[m[32m           .forJob(getProjectName(anotherFolders), '/indexing');[m
[32m+[m[32m       // creating commits from that array with a mapSeries -> not parallel[m
[32m+[m[32m       async.mapSeries(committs, function (file, callback) {[m
[32m+[m[32m           const filename = file + '.txt';[m
[32m+[m[32m           // writeFile is async so we need to use callback[m
[32m+[m[32m           fse.writeFile(path.join(pathToRepo, filename), file, function (err) {[m
[32m+[m[32m               // when we get an error we call with error[m
[32m+[m[32m               if (err) {[m
[32m+[m[32m                   callback(err);[m
[32m+[m[32m               }[m
[32m+[m[32m               // createCommit returns a promise just passing it alone[m
[32m+[m[32m               return git.createCommit(pathToRepo, [filename])[m
[32m+[m[32m                   .then(function (commitId) {[m
[32m+[m[32m                       // if we reached here we have a commit[m
[32m+[m[32m                       console.log('commitId', commitId);[m
[32m+[m[32m                       /* We are sure that all async functions have finished.[m
[32m+[m[32m                        * Now we let async know about it by[m
[32m+[m[32m                        * callback without error and the commitId[m
[32m+[m[32m                        */[m
[32m+[m[32m                       callback(null, commitId);[m
[32m+[m[32m                   })[m
[32m+[m[32m           });[m
[32m+[m
[32m+[m[32m       }, function(err, results) {[m
[32m+[m[32m           // results is an array of names[m
[32m+[m[32m           console.log('Now starting the indexing', results.length, 'commits recorded')[m
[32m+[m[32m           // start a new build by starting indexing[m
[32m+[m[32m           masterJob.indexingStarted();[m
[32m+[m[32m           // test whether we have commit[m
[32m+[m[32m           const blueRunDetailPage = browser.page.bluePipelineRunDetail().forRun(projectName, 'jenkins', 'master', 3);[m
[32m+[m[32m           // click on the changes tab[m
[32m+[m[32m           blueRunDetailPage.clickTab('changes');[m
[32m+[m[32m           // we should have a couple of commits now[m
[32m+[m[32m           blueRunDetailPage.validateNotEmptyChanges();[m
[32m+[m[32m           // make sure the windows is small[m
[32m+[m[32m           browser.resizeWindow(1000, 600);[m
[32m+[m[32m           // test now whether the authors are not listed but condendes[m
[32m+[m[32m           blueRunDetailPage.authorsIsCondensed();[m
[32m+[m[32m           // make the browser big again[m
[32m+[m[32m           browser.resizeWindow(1680, 1050);[m
[32m+[m[32m           // Wait for the job to end[m
[32m+[m[32m           blueRunDetailPage.waitForJobRunEnded(getProjectName(anotherFolders) + '/master');[m
[32m+[m[32m       });[m
[32m+[m[32m    },[m
 };[m
