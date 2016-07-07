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

Cmd.prototype.command = function (jobName, onBuildStarted) {
    var self = this;

    sseClient.onJobRunStarted(jobName, function(event) {
        console.log('**** job ' + jobName + ' started !!');
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