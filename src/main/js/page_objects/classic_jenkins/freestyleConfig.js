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
    scriptHook: {
        selector: '//textarea[@name="command"]',
        locateStrategy: 'xpath',
    },
    save: 'span.yui-button[name="Submit"]'
};
// Nightwatch commands.
// http://nightwatchjs.org/guide#writing-commands
exports.commands = [
    {
        forJob: function(jobName) {
            const jobUrl = this.api.launchUrl + 'job/' + jobName + '/configure';
            return this.navigate(jobUrl);
        },
        setFreestyleScript: function (script) {
            const scriptText = readTestScript(script);
            this.waitForElementPresent('@button')
                .click('@button')
                .waitForElementPresent('@shell')
                .click('@shell')
                .waitForElementPresent('@scriptHook');
            // we need to do the following to inject the script based on
            // https://github.com/jenkinsci/acceptance-test-harness/blob/master/src/main/java/org/jenkinsci/test/acceptance/po/CodeMirror.java
            this.api.execute(function (selector, scriptText) {
                const cmElem = document.evaluate(
                    selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
                ).singleNodeValue;
                const codemirror = cmElem.CodeMirror;
                if (codemirror == null) {
                    console.error('CodeMirror object not found!');
                }
                codemirror.setValue(scriptText);
                codemirror.save();
                return true;
            }, ['//*[@name="command"]/following-sibling::div', scriptText]);

            return this;
        }
    }
];

function readTestScript(script) {
    const fileName = 'src/test/resources/test_scripts/' + script;
    
    if (!fs.existsSync(fileName)) {
        // It's not a script file.
        // Must be a raw script text.
        return script;
    }
    
    return fs.readFileSync(fileName, 'utf8');
}