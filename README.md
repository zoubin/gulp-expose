# gulp-expose
Expose module.exports to a global object, like `window` in the browser envrionment.

## install
```
npm install --save-dev gulp-expose
```
## usage

number.js:

```
module.exports = 1;
```

```javascript
var expose = require('gulp-expose');
gulp.src('number.js')
    .pipe(expose('window', 'One'))
    .pipe(gulp.dest('dist'));
// window.MyFavNumber.One == 1
```

OR

```javascript
var expose = require('gulp-expose');
gulp.src('number.js')
    .pipe(expose('window.MyFavNumber', 'One'))
    .pipe(gulp.dest('dist'));

// window.MyFavNumber.One == 1
// as long as the namespace `window.MyFavNumber` is available.
```

And json can be exposed, too:

config.json:

```
{
    "name": "gulp-expose"
}

```

```
var expose = require('gulp-expose');
var gulp = require('gulp-rename');

gulp.src('test/src/config.json')
    .pipe(expose('window', 'PKG'))
    .pipe(rename('config.js'))
    .pipe(gulp.dest('test/dist'))

// window.PKG = { name: 'gulp-expose' }

```

### expose(host, key)

* host. String. The object that will have the exposed api. It can be any valid expression that can be evaluated as an object.
* key. [String|Function]. The property name that will be added to `host`, with the exposed api. If it is a function, it receives the file object passed in, and should return a string as the key. If falsy value returned, nothing will be done.

## example

### build

```javascript
var gulp = require('gulp');
var expose = require('gulp-expose');
gulp.src('number.js')
    .pipe(expose('window', 'One'))
    .pipe(gulp.dest('dist'));
```

### dist/number.js

```javascript
(function (host, expose) {
   var module = { exports: {} };
   var exports = module.exports;
   /****** code begin *********/
module.exports = 1;

   /****** code end *********/
   ;(
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
   ).call(null, module.exports, expose, host);
}).call(window, window, "One");

```

Now in browser:

```
window.One === 1; // true
```
