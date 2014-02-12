/**
 * Documents controller
 */
'use strict';

var request = require('request');
var async = require('async');

var anyFetchRequest = function(url, params) {
  return {
    url: url,
    qs: params,
    headers: {
      'Authorization': 'Basic ' + process.env.FETCHAPI_CREDS
    }
  };
};

module.exports.index = function(req, res) {
  var json = {};
  req.query.search = 'dartus';

  async.parallel([
    function(cb) {
      request(anyFetchRequest('http://api.anyfetch.com'), function(err, resp, body) {
        if (err) {
          return cb(err, null);
        }

        cb(null, body);
      });
    },
    function(cb){
      request(anyFetchRequest('http://api.anyfetch.com/documents', req.query), function(err, resp, body) {
        if (err) {
          return cb(err, null);
        }

        cb(null, body);
      });
    }
  ], function(err, data){
    if (err) {
      return data.status(500).send(500);
    }

    var docReturn = JSON.parse(data[1]);
    var rootReturn = JSON.parse(data[0]);
    json = docReturn;

    var document_types = {};
    for(var doc_type in docReturn.document_types) {
      console.log("bite");
      document_types[doc_type] = rootReturn.document_types[doc_type];
      document_types[doc_type].documents = docReturn.document_types[doc_type].documents;
    }
    json.document_types = document_types;

    var providers = {};
    for(var provider in rootReturn.provider_status) {
      if(docReturn.tokens[provider]) {
        providers[provider] = rootReturn.provider_status[provider];
        providers[provider].documents = docReturn.tokens[provider];
      }
    }
    json.provider = provider;

    delete json.tokens;
    res.send(json);
  });
};

module.exports.show = function(req, res) {

};