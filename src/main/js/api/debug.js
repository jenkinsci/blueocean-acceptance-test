var diag = require('@jenkins-cd/diag');

var debugs = [];

console.debug = console.log;

function setDEBUG() {
    process.env.DEBUG = debugs.join(',');
    diag.reloadConfig();
}

exports.enable = function(category) {
    if (debugs.indexOf(category) === -1) {
        debugs.push(category);
        setDEBUG();
    }
};

exports.disable = function(category) {
    var indexOf = debugs.indexOf(category);
    if (indexOf !== -1) {
        debugs = debugs.splice(indexOf, 1);
        setDEBUG();
    }
};