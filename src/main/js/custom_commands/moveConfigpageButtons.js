/**
 * Nightwatch command to move the config page buttons out of the way.
 * See http://nightwatchjs.org/guide#writing-custom-commands
 * <p/>
 * The config page save/apply buttons in classic Jenkins is sticky positioned at the bottom
 * of the page and can block events getting to elements e.g. selecting
 * build step dropdown.
 */

const util = require('util');
const events = require('events');

function Cmd() {
    events.EventEmitter.call(this);
}
util.inherits(Cmd, events.EventEmitter);

Cmd.prototype.command = function () {

    this.api.execute(function() {
        var buttonsDiv = document.documentElement.getElementsBySelector('#bottom-sticker');
        if (buttonsDiv && buttonsDiv.length == 1) {
            buttonsDiv[0].setAttribute('style', 'right: 0px;');
        }
    });

    var self = this;
    setTimeout(function() {
        self.emit('complete');
    }, 10);

    return this;
};

module.exports = Cmd;