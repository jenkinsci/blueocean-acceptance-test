// Using Gulp to run Nightwatch test suites from inside JUnit tests.
// Using Gulp because frontend (see maven deps) provides an easy way
// of running it.
// See NightwatchTest and it's impls.

var gulp  = require('gulp');
var shell = require('gulp-shell');
var jsdoc = require('gulp-jsdoc3');

if (process.argv.length === 4 && process.argv[2] === '--test') {
    gulp.task('default', shell.task('nightwatch --suiteRetries 2 ' + process.argv[3].toString()));
} else {
    gulp.task('default', shell.task('nightwatch --suiteRetries 2'));
}

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});