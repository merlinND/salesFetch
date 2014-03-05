/**
 * Salesfoce Canvas controller
 */
'use strict';

var async = require('async');
var request = require('request');
var Mustache = require('mustache');
var jsforce = require('jsforce');

var anyFetchRequest = function(url, params) {
  var translatedParameters = {};

  if (params && params.query) {
    translatedParameters.search = params.query;
  }

  return {
    url: url,
    qs: translatedParameters,
    headers: {
      'Authorization': 'Basic ' + process.env.FETCHAPI_CREDS
    }
  };
};

var retrieveDocuments = function(context, cb) {
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
      request(anyFetchRequest('http://api.anyfetch.com/documents', context), function(err, resp, body) {
        if (err) {
          return cb(err, null);
        }

        cb(null, body);
      });
    }
  ], function(err, data){
    if (err) {
      return cb(err);
    }
    var docReturn = JSON.parse(data[1]);
    var rootReturn = JSON.parse(data[0]);

    docReturn.datas.forEach(function(doc) {
      var realatedTemplate = rootReturn.document_types[doc.document_type].template_snippet;
      doc.snippet_rendered = Mustache.render(realatedTemplate, doc.datas);

      doc.provider = rootReturn.provider_status[doc.token].name;
      doc.document_type = rootReturn.document_types[doc.document_type].name;
    });

    cb(null, docReturn);
  });
};

var retrieveDocument = function(id, cb) {

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
      request(anyFetchRequest('http://api.anyfetch.com/documents/' + id), function(err, resp, body) {
        if (err) {
          return cb(err, null);
        }

        cb(null, body);
      });
    }
  ], function(err, data){
    if (err) {
      return cb(err);
    }

    var docReturn = JSON.parse(data[1]);
    var rootReturn = JSON.parse(data[0]);

    var realatedTemplate = rootReturn.document_types[docReturn.document_type].template_full;
    docReturn.full_rendered = Mustache.render(realatedTemplate, docReturn.datas);

    docReturn.provider = rootReturn.provider_status[docReturn.token].name;
    docReturn.document_type = rootReturn.document_types[docReturn.document_type].name;

    cb(null, docReturn);
  });
};

/**
 * Display Context page
 */
module.exports.context = function(req, res) {
  var params = req.session.context.environment.parameters;


  var conn = new jsforce.Connection({
    instanceUrl : req.session.context.instance_url,
    accessToken : req.session.context.oauth_token
  });

  conn.sobject(params.record.object_type).retrieve(params.record.record_id, function(err, account) {
    if (err) { return console.error(err); }
    console.log("Name : " + account.Name);
  });

  retrieveDocuments(params.record, function(err, datas) {

    res.render('canvas/timeline.html', {
      context: params.record,
      documents: datas
    });

  });
};

/**
 * Show full document
 */
module.exports.show = function(req, res) {
  retrieveDocument(req.params.documentId, function(err, datas) {

    res.render('canvas/show.html', {
      document: datas
    });

  });
};

/*
 * Display Search page
 */
module.exports.search = function(req, res) {
  res.render('canvas/search.html', {
    user: req.user
  });
};

/*
 * Retrieve a single document
 */
module.exports.document = function(req, res) {

};