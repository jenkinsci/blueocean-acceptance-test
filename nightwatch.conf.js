module.exports = (function (settings) {
    var fs = require('fs');
    var jenkins_url_file = 'target/.jenkins_url';
    
    if (!fs.existsSync(jenkins_url_file)) {
        throw 'Jenkins not running. Failed to find file: ' + jenkins_url_file;
    }

    var launchUrl = fs.readFileSync(jenkins_url_file, 'utf8');
    
    console.log('Jenkins running at: ' + launchUrl);
    
    settings.test_settings.default.launch_url = launchUrl;

    if (fs.existsSync('target/.selenium_server_provided')) {
        settings.selenium.start_process = false;
    }
    
    return settings;
})(require('./src/main/nightwatch.json'));