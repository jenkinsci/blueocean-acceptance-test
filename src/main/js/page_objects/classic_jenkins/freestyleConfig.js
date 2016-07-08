// Pipeline config page object (http://nightwatchjs.org/guide#page-objects)

var fs = require('fs');

exports.elements = {
    button: {
        selector: '//button[@path="/hetero-list-add[builder]"]',
        locateStrategy: 'xpath',
    },
    shell: {
        selector: '//a[text()="Execute shell"]',
        locateStrategy: 'xpath',
    },
    scriptInput: 'textarea.codemirror',
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
        setFreestyleScript: function (script) {
            var scriptText = readTestScript(script);
            this.waitForElementPresent('@button')
                .click('@button')
                .waitForElementPresent('@shell')
                .click('@shell')
                .waitForElementPresent('@scriptInput')
            this.api.execute(function (scriptText) {
                //FIXME talk to tfennelly how to fix it (the next is not working)
                CodeMirror.setValue(scriptText);
                return true;
            }, [scriptText]);
            
            return this;
        }
    }
];

function readTestScript(script) {
    var fileName = 'src/test/js/test_pipelines_scripts/' + script;
    
    if (!fs.existsSync(fileName)) {
        // It's not a script file.
        // Must be a raw script text.
        return script;
    }
    
    return fs.readFileSync(fileName, 'utf8');
}