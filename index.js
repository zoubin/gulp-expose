var through = require('through2');

module.exports = gulpExports;

function gulpExports(host, exports) {
    var expose = exports;
    if (!expose) {
        expose = host;
        host = 'this';
    }
    if (typeof expose === 'string') {
        exports = expose;
        expose = function () {
            return exports;
        };
    }
    if (typeof expose !== 'function') {
        expose = false;
    }

    return through.obj(function (file, enc, next) {
        if (!file.isBuffer()) {
            return next(null, file);
        }
        var exposeKey = expose && expose(file);
        if (!exposeKey) {
            return next(null, file);
        }
        var contents = file.contents.toString(enc);
        if (/\.json$/.test(file.path)) {
            contents = 'module.exports=' + contents;
        }
        contents = wrap(contents, host, exposeKey);
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

