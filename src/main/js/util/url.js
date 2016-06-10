module.exports = {
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