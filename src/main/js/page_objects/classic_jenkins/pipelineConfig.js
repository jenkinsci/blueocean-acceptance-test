// Pipeline config page object (http://nightwatchjs.org/guide#page-objects)

var fs = require('fs');

exports.elements = {
    scriptInput: '#workflow-editor-1 .ace_text-input',
    save: 'span.yui-button[name="Submit"]'
};

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
exports.commands = [
    {
        forJob: function(jobName) {
            var jobUrl = this.api.launchUrl + 'job/' + jobName + '/configure';
            return this.navigate(jobUrl);
        },
        setPipelineScript: function (script) {
            var scriptText = readTestScript(script);
    
            // Need to wait for the ACE Editor to fully render on the page
            this.waitForElementPresent('@scriptInput');
            this.api.execute(function (selector, scriptText) {
                var targets = document.getElementsBySelector(selector);
                targets[0].aceEditor.setValue(scriptText);
                return true;
            }, ['#workflow-editor-1', scriptText]);
            
            return this;
        }
    }
];

function readTestScript(script) {
    var fileName = 'src/test/resources/test_scripts/' + script;
    
    if (!fs.existsSync(fileName)) {
        // It's not a script file.
        // Must be a raw script text.
        return script;
    }
    
    return fs.readFileSync(fileName, 'utf8');
}