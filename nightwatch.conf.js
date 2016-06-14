module.exports = (function (settings) {
    var fs = require('fs');
    var jenkins_url_file = 'target/.jenkins_url';
    
    if (!fs.existsSync(jenkins_url_file)) {
        throw 'Jenkins not running. Failed to find file: ' + jenkins_url_file;
    }
    
    settings.test_settings.default.launch_url = fs.readFileSync(jenkins_url_file, 'utf8');
    settings.selenium.start_process = false; // TODO: use a file or something to make this configurable - CI script could create it
    
    return settings;
})(require('./src/main/nightwatch.json'));