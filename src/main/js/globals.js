var sse = require('./api/sse');

require('./api/debug');

module.exports = {
    waitForConditionTimeout: 20000,
    default: {
        beforeEach: function (browser, done) {
            browser.windowMaximize();
            removeBreadcrumbBarOnNavigate(browser);
            sse.connect(browser, done);
        },
        afterEach: function (browser, done) {
            try {
                browser.end();
            } finally {
                sse.disconnect(function() {
                    done();
                });
            }
        }
    }
};

function removeBreadcrumbBarOnNavigate(browser) {
    //
    // Hack time !!! ...
    // Iterate over all of the page objects and wrap the navigate
    // function so that we remove the breadcrumb bar from the page
    // just after navigating to it and before trying to do anything.
    //

    var glob = require('glob');
    var classicPageObjects = glob.sync('src/main/js/page_objects/classic_jenkins/*.js');

    for (var i = 0; i < classicPageObjects.length; i++) {
        var pageObjectName = classicPageObjects[i].replace('src/main/js/page_objects/classic_jenkins/', '').replace('.js', '');
        doNavigateWrap(pageObjectName);
    }

    function doNavigateWrap(pageObjectName) {
        var factoryFunction = browser.page[pageObjectName];

        // Need to wrap the factory function that creates
        // the page object...
        browser.page[pageObjectName] = function() {
            var thePage = factoryFunction();
            var navFunc = thePage.navigate;

            // Need to wrap the 'navigate' function on
            // the page object...
            thePage.navigate = function() {
                return navFunc.apply(this, arguments).removeBreadcrumbBar();
            };

            return thePage;
        };
    }
}