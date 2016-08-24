/**
 * Nightwatch command to wait for a job run to start.
 * See http://nightwatchjs.org/guide#writing-custom-commands
 */

const util = require('util');
const events = require('events');
var sseClient = require('../api/sse');

function Cmd() {
    events.EventEmitter.call(this);
}
util.inherits(Cmd, events.EventEmitter);

Cmd.prototype.command = function (jobName, onBuildStarted, timeout) {
    var self = this;

    var waitTimeout = setTimeout(function() {
        var error = new Error('Timed out waiting for job/pipeline "' + jobName + '" run to start.');
        self.emit('error', error);
    }, (typeof timeout === 'number' ? timeout : 20000));
    
    console.log('Waiting for job/pipeline "' + jobName + '" run to start.');
    sseClient.onJobRunStarted(jobName, function(event) {
        clearTimeout(waitTimeout);
        console.log('Job/pipeline "' + jobName + '" run started.');
        try {
            if (onBuildStarted) {
                onBuildStarted(event);
            }
        } finally {
            self.emit('complete');
        }
    });

    return this;
};

module.exports = Cmd;