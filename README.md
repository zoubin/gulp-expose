# gulp-exports
Expose module.exports to a global object, like `window` in the browser envrionment.

## install
```
npm install --save-dev gulp-exports
```

## usage

### number.js
```
module.exports = 1;
```

### build

```javascript
var gulp = require('gulp');
var wrap = require('gulp-exports');
gulp.src('number.js')
    .pipe(wrap('window', 'One'))
    .pipe(gulp.dest('dist'));
```

### dist/number.js

```javascript
(function (module, exports) {
   var _exports = module.exports;
   module.exports = module["One"] || {};
   exports = module["One"] = module.exports;
   /****** code begin *********/
module.exports = 1;

   /****** code end *********/
   if (typeof _exports === "undefined") {
       delete module.exports;
   } else if ("One" !== "exports") {
       module.exports = _exports;
   }
}).call(window, window, window["One"]);

```

Now in browser:

```
window.One === 1; // true
```
