// Pipeline config page object (http://nightwatchjs.org/guide#page-objects)

var fs = require('fs');

// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
var commands = {
    setPipelineScript: function (script) {
        var scriptText = readTestScript(script);

        // Need to wait for the ACE Editor to fully render on the page
        this.waitForElementPresent('@scriptInput', 5000);
        this.api.execute(function (selector, scriptText) {
            var targets = document.getElementsBySelector(selector);
            targets[0].aceEditor.setValue(scriptText);
            return true;
        }, ['#workflow-editor-1', scriptText]);
        
        return this;
    }
};

module.exports = {
    commands: [commands],
    elements: {
        scriptInput: {
            selector: '#workflow-editor-1 .ace_text-input'
        },
        save: {
            selector: 'span.yui-button[name="Submit"]'
        }
    }
};

function readTestScript(script) {
    var fileName = 'src/test/js/specs/test_pipelines_scripts/' + script;
    
    if (!fs.existsSync(fileName)) {
        // It's not a script file.
        // Must be a raw script text.
        return script;
    }
    
    return fs.readFileSync(fileName, 'utf8');
}