module.exports = (function (settings) {
    var fs = require('fs');
    var launchUrl;
    
    if (process.env.LAUNCH_URL) {
        //
        // This allows you to run the tests against a Jenkins instance of
        // your choosing when manually running nightwatch e.g. one running in your
        // IDE, allowing you to debug the server etc.
        //
        // Command line example:
        //   LAUNCH_URL=http://localhost:8080/jenkins nightwatch
        //
        // Remember, you'll need to:
        //   1. set <useSecurity> to "false" in $JENKINS_HOME/config.xml.
        //   2. remove <crumbIssuer> from $JENKINS_HOME/config.xml.
        //   3. run "touch target/.jenkins_test" in the directory in which
        //      you are running jenkins i.e. in the aggregator dir.
        //
        launchUrl = process.env.LAUNCH_URL;
    } else {
        var jenkins_url_file = 'target/.jenkins_url';

        if (!fs.existsSync(jenkins_url_file)) {
            throw 'Jenkins not running. Failed to find file: ' + jenkins_url_file;
        }

        launchUrl = fs.readFileSync(jenkins_url_file, 'utf8');
    }
    
    console.log('Jenkins running at: ' + launchUrl);
    
    settings.test_settings.default.launch_url = launchUrl;

    if (fs.existsSync('target/.selenium_server_provided')) {
        settings.selenium.start_process = false;
    }
    
    return settings;
})(require('./src/main/nightwatch.json'));