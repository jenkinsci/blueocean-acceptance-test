/**
 * Checks if the current url matches (regex) the given value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.urlMatches('my-pipeline\/activity$'); // ends with
 *    };
 * ```
 *
 * @method urlMatches
 * @param {string} expectedPattern The expected url pattern (RegEx).
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 */

var util = require('util');
exports.assertion = function (expectedPattern, msg) {

    this.message = msg || util.format('Testing if the URL matches RegEx "%s".', expectedPattern);
    this.expected = new RegExp(expectedPattern);

    this.pass = function (value) {
        return this.expected.test(value);
    };

    this.value = function (result) {
        return result.value;
    };

    this.command = function (callback) {
        this.api.url(callback);
        return this;
    };

};