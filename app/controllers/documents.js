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
      document_types[doc_type] = rootReturn.document_types[doc_type];
      document_types[doc_type].documents = docReturn.document_types[doc_type].documents;
    }
    json.document_types = document_types;

    var providers = {};
    for(var provider in docReturn.tokens) {
      providers[provider] = rootReturn.provider_status[provider];
      providers[provider].documents = docReturn.tokens[provider];
    }
    json.providers = providers;

    delete json.tokens;
    res.send(json);
  });
};

module.exports.show = function(req, res) {
  var json = {};

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
      request(anyFetchRequest('http://api.anyfetch.com/documents/' + req.params.id), function(err, resp, body) {
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
    json.document_type = rootReturn.document_types[docReturn.document_type];
    json.token = rootReturn.provider_status[docReturn.token];

    res.send(json);
  });
};