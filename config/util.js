'use strict';

var fs = require('fs');

// Recursively walk modules path and callback for each file
module.exports = function walk(path, fileCb) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      fileCb(newPath);
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};