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

    console.log(rootReturn.document_types);
    console.log(docReturn);

    var realatedTemplate = rootReturn.document_types[docReturn.document_type].template_full;
    docReturn.full_rendered = Mustache.render(realatedTemplate, docReturn.datas);

    docReturn.provider = rootReturn.provider_status[docReturn.token].name;
    docReturn.document_type = rootReturn.document_types[docReturn.document_type].name;

    cb(null, docReturn);
  });
};

/*
 * Display specific context
 */
var displayContext = function(req, res) {
  var params = req.session.context.environment.parameters;
  retrieveDocuments(params.record, function(err, datas) {

    res.render('canvas/timeline.html', {
      context: params.record,
      documents: datas
    });

  });
};

module.exports.index = function(req, res) {
  var params = req.session.context.environment.parameters;
  if(params.mode === "search") {
    displaySearch(req, res);
  } else {
    displayContext(req, res);
  }
};

module.exports.show = function(req, res) {
  retrieveDocument(req.params.id, function(err, datas) {

    res.render('canvas/show.html', {
      document: datas
    });

  });
};