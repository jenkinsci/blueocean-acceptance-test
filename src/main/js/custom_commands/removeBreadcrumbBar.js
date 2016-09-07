/**
 * Nightwatch command to wait for a job be created.
 * See http://nightwatchjs.org/guide#writing-custom-commands
 * <p/>
 * The breadcrumb bar in classic Jenkins is sticky positioned at the top
 * of the page and can block events getting to elements e.g. selecting
 * the job type on the create item page. This command removes it completely
 * by injecting some JS into the page.
 */

const util = require('util');
const events = require('events');

function Cmd() {
    events.EventEmitter.call(this);
}
util.inherits(Cmd, events.EventEmitter);

Cmd.prototype.command = function () {

    this.api.execute(function() {
        var breadcrumb = document.documentElement.getElementsBySelector('#breadcrumbBar');
        if (breadcrumb && breadcrumb.length == 1) {
            breadcrumb[0].parentElement.removeChild(breadcrumb[0]);
        }
    });

    var self = this;
    setTimeout(function() {
        self.emit('complete');
    }, 10);

    return this;
};

module.exports = Cmd;