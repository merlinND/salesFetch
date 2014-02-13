/**
 * Salesfoce Canvas controller
 */
'use strict';

var async = require('async');
var request = require('request');
var Mustache = require('mustache');

/*
 * Display Search page
 */
var displaySearch = function(req, res) {
  res.render('canvas/search.html', {
    user: req.user
  });
};

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
    });

    cb(null, docReturn);
  });
};


/*
 * Display specific context
 */
var displayContext = function(req, res) {
  var params = req.session.context.environment.parameters;
  retrieveDocuments(params.record, function(err, datas) {

    console.log(datas.datas);
    res.render('canvas/timeline.html', {
      context: params.record,
      documents: datas
    });

  });
};

module.exports = function(req, res) {
  var params = req.session.context.environment.parameters;
  if(params.mode === "search") {
    displaySearch(req, res);
  } else {
    displayContext(req, res);
  }
};