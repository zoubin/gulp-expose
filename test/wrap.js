var assert = require('chai').assert;
var expose = require('../index.js');
var gulp = require('gulp');
var rename = require('gulp-rename');

describe('export node modules', function () {
    it('number', function (cb) {
        gulp.src('test/src/number.js')
            .pipe(expose(exposeConf))
            .pipe(gulp.dest('test/dist'))
            .on('finish', function () {
                assert.equal(require('./dist/number.js'), 1, 'should be exported');
                cb();
            });
    });
    it('object', function (cb) {
        gulp.src('test/src/object.js')
            .pipe(expose(exposeConf))
            .pipe(gulp.dest('test/dist'))
            .on('finish', function () {
                var o = require('./dist/object.js');
                assert.isFunction(o.fn, 'should be exported');
                cb();
            });
    });
    it('json', function (cb) {
        gulp.src('test/src/config.json')
            .pipe(expose(exposeConf))
            .pipe(rename('config.js'))
            .pipe(gulp.dest('test/dist'))
            .on('finish', function () {
                var o = require('./dist/config.js');
                assert.deepEqual(o, { name: 'gulp-expose' }, 'should be exported');
                cb();
            });
    });
});

function exposeConf(file) {
    return {
        host: 'module',
        expose: 'exports'
    };
}
