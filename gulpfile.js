var gulp  = require('gulp');
var shell = require('gulp-shell');

if (process.argv.length === 4 && process.argv[2] === '--test') {
    gulp.task('default', shell.task('nightwatch ' + process.argv[3].toString()));
} else {
    gulp.task('default', shell.task('nightwatch'));
}

