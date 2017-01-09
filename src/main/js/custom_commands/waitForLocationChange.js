/**
 * @module waitForLocationChange
 * @memberof custom_commands
 */
const util = require('util');
const events = require('events');

function Cmd() {
    events.EventEmitter.call(this);
}
util.inherits(Cmd, events.EventEmitter);

var POLLING_FREQUENCY = 100;
var TIMEOUT = 5000;

/**
 * @description Nightwatch command to wait for the browser's href to change.
 * Polls the browser at a given frequency to wait for any change to location.href
 */
const waitForLocationChange = function () {
    var self = this;
    // var startTime = new Date().getTime();
    var locationPollingTimeout = null;

    self.api.url(function(response) {
        var initialHref = response.value;

        var checkForUrlChange = function() {
            self.api.url(function (response) {
                if (response.value !== initialHref) {
                    // var ellapsed = new Date().getTime() - startTime;
                    // console.log('url changed from: ' + initialHref + ' to: ' + response.value + 'after ' + ellapsed + ' milliseconds.');
                    cleanUp();
                    self.emit('complete');
                }
                else {
                    locationPollingTimeout = setTimeout(checkForUrlChange, POLLING_FREQUENCY);
                }
            });
        };

        var errorTimeout = setTimeout(function() {
            cleanUp();
            var error = new Error('timed out waiting for location change');
            self.emit('error', error);
        }, TIMEOUT);

        var cleanUp = function() {
            clearTimeout(locationPollingTimeout);
            clearTimeout(errorTimeout);
        };

        checkForUrlChange();
    });

    return this;
};

Cmd.prototype.command = waitForLocationChange;
module.exports = Cmd;