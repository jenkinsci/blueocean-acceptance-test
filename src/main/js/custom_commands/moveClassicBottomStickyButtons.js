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
        (function () {
            function jQuery(callback) {
                try {
                    // In classic Jenkins, we can try dipping into the js-modules
                    // and get jQuery. If it's not there, then we're not in classic Jenkins
                    // and we don't care.
                    callback(window.jenkinsCIGlobal.plugins["jquery-detached"].jquery2.exports);
                } catch(e) {
                    // ignore
                }
            }

            jQuery(function ($) {
                $(function() {
                    // Make the new item page stick buttons non-sticky
                    var createButtonsDiv = document.documentElement.getElementsBySelector('#createItem .footer');
                    if (createButtonsDiv && createButtonsDiv.length == 1) {
                        createButtonsDiv[0].setAttribute('style', 'position: inherit;');
                        var thebutton = createButtonsDiv[0].getElementsBySelector('.btn-decorator')[0];
                        thebutton.setAttribute('style', 'bottom: null');
                        // Need to remove the window scroll listeners because they'll
                        // reapply all styles etc.
                        $(window).off('scroll');
                    }
                    // Make the config page buttons non-sticky
                    function moveConfigButtons() {
                        var condfigButtonsDiv = document.documentElement.getElementsBySelector('#bottom-sticker');
                        if (condfigButtonsDiv && condfigButtonsDiv.length == 1) {
                            condfigButtonsDiv[0].setAttribute('style', 'right: 0px; display: inline-block;');
                        }
                    }
                    moveConfigButtons();
                    $(window).scroll(function() {
                        // There's all sorts of prototype gunk on classic Jenkins,
                        // some of which we can't get at to remove the listeners etc,
                        // so only option that seems to be left is to listen for scroll
                        // events and set a timeout to undo the prototype gunk.
                        setTimeout(function() {
                            moveConfigButtons();
                        }, 10);
                    });

                    // Make the emmision of the "complete" event (below) a bit
                    // more deterministic.
                    $('body').addClass('bottom-buttons-unstickied');
                });
            });
        }());
    });

    var self = this;
    setTimeout(function() {
        self.api.waitForElementPresent('body.bottom-buttons-unstickied', function() {
            self.emit('complete');
        });
    }, 10);

    return this;
};

module.exports = Cmd;