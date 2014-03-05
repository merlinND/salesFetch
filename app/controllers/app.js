/**
 * Salesfoce Canvas controller
 */
'use strict';

var async = require('async');
var request = require('request');
var Mustache = require('mustache');
var jsforce = require('jsforce');
var _ = require('lodash');

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
  var contextDisplay= null;

  async.waterfall([
    function(cb) {
      // Retrive the context object
      var conn = new jsforce.Connection({
        instanceUrl : req.session.context.instance_url,
        accessToken : req.session.context.oauth_token
      });
      conn.sobject(params.record.object_type).retrieve(params.record.record_id, cb);
    }, function(record, cb) {
      // Get the search and display specification for the context
      var orgProfilers = req.session.user.context_profilers;
      var profiler = _.find(orgProfilers, {object_type: params.record.object_type});

      if (!profiler) {
        return cb('no_context_sepcifier');
      }
      var builtQuery = Mustache.render(profiler.query_template, record);
      contextDisplay = Mustache.render(profiler.display_template, record);

      // Retrieve documents matching the query
      retrieveDocuments(builtQuery, cb);
    }
  ], function(err, datas) {
    if (err || 'no_context_sepcifier') {
      return res.send(500);
    }

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