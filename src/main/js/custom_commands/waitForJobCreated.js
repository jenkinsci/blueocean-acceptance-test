/**
 * Nightwatch command to wait for a job be created.
 * See http://nightwatchjs.org/guide#writing-custom-commands
 */

const util = require('util');
const events = require('events');
var sseClient = require('../api/sse');

function Cmd() {
    events.EventEmitter.call(this);
}
util.inherits(Cmd, events.EventEmitter);

Cmd.prototype.command = function (jobName, onCreated) {
    var self = this;

    console.log('Waiting on job "' + jobName + '" to be created.');
    sseClient.onJobCreated(jobName, function () {
        console.log('Job "' + jobName + '" created.');
        try {
            if (onCreated) {
                onCreated(event);
            }
        } finally {
            self.emit('complete');
        }
    });
    
    return this;
};

module.exports = Cmd;