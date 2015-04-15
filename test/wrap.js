var assert = require('chai').assert;
var wrap = require('../index.js');
var gulp = require('gulp');

describe('export node modules', function () {
    it('number', function (cb) {
        gulp.src('test/src/number.js')
            .pipe(wrap('module', 'exports'))
            .pipe(gulp.dest('test/dist'))
            .on('finish', function () {
                assert.equal(require('./dist/number.js'), 1, 'should be exported');
                cb();
            });
    });
    it('object', function (cb) {
        gulp.src('test/src/object.js')
            .pipe(wrap('module', 'exports'))
            .pipe(gulp.dest('test/dist'))
            .on('finish', function () {
                var o = require('./dist/object.js');
                assert.isFunction(o.fn, 'should be exported');
                cb();
            });
    });
});
