'use strict';

/**
 * FetchAPI mockup for testing
 */

var fs = require('fs');
var nock = require('nock');

var fetchAPI;

/**
 * Retrieve all the paths
 */
var walk = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile() && file.substr(file.lastIndexOf('.')+1) === 'json') {
      var endPointConfig = JSON.parse(fs.readFileSync(newPath, 'utf8'));
      fetchAPI
        .intercept(endPointConfig.path, endPointConfig.verb)
        .reply(endPointConfig.code ,endPointConfig.reply);

    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};

/**
 * Override all the HTTP requests on the server
 */
module.exports.mount = function(cb) {
  fetchAPI = nock('http://api.anyfetch.com');

  // Walk trhought the folder to find endpoints for the mock server
  var apiPath = __dirname + '/fetchAPI-mock';
  walk(apiPath);

  cb(null, fetchAPI);
};

/**
 * Reset the HTTP calls on the fetchAPI
 */
module.exports.unmount = function() {
  fetchAPI.restore();
  return;
};