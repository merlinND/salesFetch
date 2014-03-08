'use strict';

var jsforce = require('jsforce');

module.exports.loadObject = function(instanceUrl, oauthToken, objectType, recordId, cb) {
  var conn = new jsforce.Connection({
    instanceUrl : instanceUrl,
    accessToken : oauthToken
  });

  conn
    .sobject(objectType)
    .retrieve(recordId, cb);
};
