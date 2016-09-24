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
    var self = this;

    this.api.execute(function() {
        (function () {
            function waitForJQuery() {
                try {
                    // In classic Jenkins, we can try dipping into the js-modules
                    // and get jQuery. If it's not there, then we're not in classic Jenkins
                    // and we don't care.
                    var $ = window.jenkinsCIGlobal.plugins["jquery-detached"].jquery2.exports;
                    doTweaks($);
                } catch(e) {
                    setTimeout(waitForJQuery, 50);
                }
            }
            function doTweaks($) {
                $(function() {
                    // Make the new item page stick buttons non-sticky
                    var createButtonsDiv = $('#createItem .footer');
                    var thebutton = $('.btn-decorator', createButtonsDiv);

                    createButtonsDiv.css('position', 'inherit');
                    thebutton.css('bottom', 'null');

                    // Need to remove the window scroll listeners because they'll
                    // reapply all styles etc.
                    $(window).off('scroll');

                    // Make the config page buttons non-sticky
                    function moveConfigButtons() {
                        var condfigButtonsDiv = $('#bottom-sticker');
                        condfigButtonsDiv.css({
                            'right': '0px',
                            'display': 'inline-block'
                        });
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

                    // Make the emission of the "complete" event (below) a bit
                    // more deterministic.
                    $('body').addClass('bottom-buttons-unstickied');
                });
            }
            waitForJQuery();
        }());
    });

    setTimeout(function() {
        self.api.waitForElementPresent('body.bottom-buttons-unstickied', function() {
            self.emit('complete');
        });
    }, 10);

    return this;
};

module.exports = Cmd;