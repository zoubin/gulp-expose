var through = require('through2');
var path = require('path');

module.exports = gulpExpose;

function gulpExpose(host, expose) {
    var getExposeInfo;
    if (typeof host === 'function') {
        getExposeInfo = host;
    } else {
        getExposeInfo = function (file) {
            return {
                host: host,
                expose: expose
            };
        };
    }

    return through.obj(function (file, enc, next) {
        var info = getExposeInfo(file);
        if (!file.isBuffer() || !info.expose) {
            return next(null, file);
        }
        var contents = file.contents.toString(enc);
        if (/\.json$/.test(file.path)) {
            contents = 'module.exports=' + contents;
        }
        contents = wrap(contents, info.host, info.expose);
        file.contents = new Buffer(contents, enc);
        next(null, file);
    });
}

function wrap(code, host, expose) {
    return [
        '(function (host, expose) {',
        '   var module = { exports: {} };',
        '   var exports = module.exports;',
        '   /****** code begin *********/',
        code,
        '   /****** code end *********/',
        '   ;(',
        copy.toString(),
        '   ).call(null, module.exports, expose, host);',
        '}).call(' + [host, host, '"' + expose + '"'].join(', ') + ');'
    ].join('\n');
}

function copy(src, target, obj) {
    obj[target] = obj[target] || {};
    if (src && typeof src === 'object') {
        for (var k in src) {
            if (src.hasOwnProperty(k)) {
                obj[target][k] = src[k];
            }
        }
    } else {
        obj[target] = src;
    }
}

