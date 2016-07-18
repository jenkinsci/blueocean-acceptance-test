/**
 * Nightwatch command to wait for a job run to end.
 * See http://nightwatchjs.org/guide#writing-custom-commands
 */

const util = require('util');
const events = require('events');
var sseClient = require('../api/sse');

function Cmd() {
    events.EventEmitter.call(this);
}
util.inherits(Cmd, events.EventEmitter);

Cmd.prototype.command = function (jobName, onBuildComplete) {
    var self = this;

    console.log('Waiting for job/pipeline "' + jobName + '" run to end.');
    sseClient.onJobRunEnded(jobName, function(event) {
        try {
            if (onBuildComplete) {
                onBuildComplete(event);
            }
        } finally {
            self.emit('complete');
        }
    });

    return this;
};

module.exports = Cmd;