module.exports = {
    getJobUrl: function (launchUrl, jobName) {
        // in case we have multiBranch projects or we are using folder, we need to calcultate the path
        const nameArray = jobName.split('/');
        var jobUrl = launchUrl;
        nameArray.map(function (item) {
            jobUrl += 'job/' + item + '/';
        });
        return jobUrl;
    },
    makeRelative: function(url) {
        return url.indexOf("/") ?
            url.substr(1) :
            url;
    },
    configureBuildExecutor: function () {
        return '/computer/(master)/configure';
    },
    viewAllPipelines: function() {
        return '/blue/pipelines';
    },
    viewPipeline: function(orgName, jobName) {
        return '/blue/organizations/' + orgName + '/' + jobName;
    },
    viewPipelineActivity: function(orgName, jobName) {
        return this.viewPipeline(orgName, jobName) + '/activity';
    },
    viewRunPipeline: function(orgName, jobName, branchName, buildNumber) {
        return '/blue/organizations/' + orgName + '/' + jobName + '/detail/' + branchName + '/' + buildNumber;
    },
    tabSelector: function(tabName) {
        return 'nav.page-tabs a.' + tabName;
    },
    clickTab: function(browser, self, tab) {
        const tabSelector = this.tabSelector(tab);
        self.waitForElementVisible(tabSelector);
        self.click(tabSelector);
        browser.url(function (response) {
                self.assert.equal(typeof response, "object");
                self.assert.equal(response.status, 0);
                // did we changed the url on  change?
                self.assert.equal(response.value.includes(tab), true);
                return self;
            })
    },
};