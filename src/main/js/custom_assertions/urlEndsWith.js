/**
 * Checks if the current url ends with the given value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.urlEndsWith('/blue/organizations/jenkins/my-pipeline/activity');
 *    };
 * ```
 *
 * @method urlEndsWith
 * @param {string} expected The expected url.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(expected, msg) {

    this.message = msg || util.format('Testing if the URL ends with "%s".', expected);
    this.expected = expected;

    this.pass = function(value) {
        return value.endsWith(expected);
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback) {
        this.api.url(callback);
        return this;
    };

};