/** @module blueNotFound
 * @memberof page_objects
 * @description Represents the default 404 page in blueocean
 *
 * @example
 *   browser.page.blueNotFound().xxx();
 * */
module.exports = {
    elements: {
        fullscreenDiv: '.fullscreen.not-found',
        title: '.fullscreen.not-found .message-box h3',
        message: '.fullscreen.not-found .message-box .message',
        link: '.fullscreen.not-found .message-box .actions a',
    }
};
module.exports.commands = [{
  /**
   * Different test on general elements that should be visible on the page
   * @returns {Object} self - nightwatch page object
   */
  assertBasicLayoutOkay: function () {
    this.waitForElementVisible('@fullscreenDiv');
    this.waitForElementVisible('@title');
    this.waitForElementVisible('@message');
    this.waitForElementVisible('@link');
  },

}];