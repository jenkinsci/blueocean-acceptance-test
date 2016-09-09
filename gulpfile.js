// Using Gulp to run Nightwatch test suites from inside JUnit tests.
// Using Gulp because frontend (see maven deps) provides an easy way
// of running it.
// See NightwatchTest and it's impls.

const gulp  = require('gulp');
const shell = require('gulp-shell');
const jsdoc = require('gulp-jsdoc3');
const watch = require('gulp-watch');

if (process.argv.length === 4 && process.argv[2] === '--test') {
    gulp.task('default', shell.task('nightwatch --suiteRetries 2 ' + process.argv[3].toString()));
} else {
    gulp.task('default', shell.task('nightwatch --suiteRetries 2'));
}

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});

gulp.task('docwatch', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    return watch('./src/**/*.js', function (cb) {
        gulp.src(['README.md', './src/**/*.js'], {read: false})
            .pipe(jsdoc(cb));
    });
});