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
    }
};