var request = require('request');

exports.newPipeline = function(browser, jobName, script, oncreated) {
    exports.deletePipeline(browser, jobName, function() {
        var newPipeline = browser.page.pipelineCreate().navigate();
    
        newPipeline.setValue('@nameInput', jobName);
        newPipeline.click('@pipelineJobType');
        newPipeline.click('@submit', function () {
            exports.configurePipeline(browser, jobName)
                .setPipelineScript(script)
                .click('@save', oncreated);
        });
    });
};

exports.deletePipeline = function(browser, jobName, ondeleted) {
    var deleteUrl = browser.launchUrl + 'job/' + jobName + '/doDelete';
    request.post(deleteUrl, ondeleted);
};

exports.configurePipeline = function(browser, jobName) {
    var jobUrl = browser.launchUrl + 'job/' + jobName + '/configure';
    return browser.page.pipelineConfig().navigate(jobUrl);
};