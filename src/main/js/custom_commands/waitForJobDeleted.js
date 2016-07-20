/**
 * Nightwatch command to wait for a job be deleted.
 * See http://nightwatchjs.org/guide#writing-custom-commands
 */

const util = require('util');
const events = require('events');
var request = require('request');

function Cmd() {
    events.EventEmitter.call(this);
}
util.inherits(Cmd, events.EventEmitter);

Cmd.prototype.command = function (jobName, onDeleted) {
    var self = this;

    console.log('Waiting on job "' + jobName + '" to be deleted.');
    var deleteUrl = this.api.launchUrl + 'job/' + jobName + '/doDelete';
    request.post(deleteUrl, function() {
        console.log('Job "' + jobName + '" deleted.');
        try {
            if (onDeleted) {
                onDeleted(event);
            }
        } finally {
            self.emit('complete');
        }
    });
    
    return this;
};

module.exports = Cmd;