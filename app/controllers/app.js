/**
 * Salesfoce Canvas controller
 */
'use strict';

var async = require('async');
var request = require('request');
var Mustache = require('mustache');
var jsforce = require('jsforce');
var _ = require('lodash');

var mongoose = require('mongoose');
var Organization = mongoose.model('Organization');

var anyFetchRequest = function(url, builtQuery) {
  var translatedParameters = {
    search : builtQuery
  };

  return {
    url: url,
    qs: translatedParameters,
    headers: {
      'Authorization': 'Basic ' + process.env.FETCHAPI_CREDS
    }
  };
};

var retrieveDocuments = function(builtQuery, cb) {
  async.parallel([
    function(cb) {
      request(anyFetchRequest('http://api.anyfetch.com'), cb);
    },
    function(cb){
      request(anyFetchRequest('http://api.anyfetch.com/documents', builtQuery), cb);
    }
  ], function(err, data){
    if (err) {
      return cb(err);
    }
    var docReturn = JSON.parse(data[1][0].body);
    var rootReturn = JSON.parse(data[0][0].body);

    docReturn.datas.forEach(function(doc) {
      var relatedTemplate = rootReturn.document_types[doc.document_type].template_snippet;
      doc.snippet_rendered = Mustache.render(relatedTemplate, doc.datas);

      doc.provider = rootReturn.provider_status[doc.token].name;
      doc.document_type = rootReturn.document_types[doc.document_type].name;
    });

    cb(null, docReturn);
  });
};

var retrieveDocument = function(id, cb) {
  async.parallel([
    function(cb) {
      request(anyFetchRequest('http://api.anyfetch.com'), cb);
    },
    function(cb){
      request(anyFetchRequest('http://api.anyfetch.com/documents/' + id), cb);
    }
  ], function(err, data){
    if (err) {
      return cb(err);
    }

    var docReturn = JSON.parse(data[1][0].body);
    var rootReturn = JSON.parse(data[0][0].body);

    var relatedTemplate = rootReturn.document_types[docReturn.document_type].template_full;
    docReturn.full_rendered = Mustache.render(relatedTemplate, docReturn.datas);

    docReturn.provider = rootReturn.provider_status[docReturn.token].name;
    docReturn.document_type = rootReturn.document_types[docReturn.document_type].name;

    cb(null, docReturn);
  });
};

/**
 * Display Context page
 */
module.exports.context = function(req, res) {
  var passedContext = req.session.context;

  async.waterfall([
    function(cb) {
      // Retrive the context object
      var conn = new jsforce.Connection({
        instanceUrl : passedContext.instance_url,
        accessToken : passedContext.oauth_token
      });
      conn
        .sobject(passedContext.params.record.object_type)
        .retrieve(passedContext.params.record.record_id, cb);
    }, function(record, cb) {
      // Retrieve the context profilers

      Organization.findOne({_id: req.session.user.organization}, function(err, org) {

        if (err || !org) {
          return cb(err);
        }

        cb(null, record, org.context_profilers);
      });
    }, function(record, orgProfilers, cb) {
      var profiler = _.find(orgProfilers, {object_type: passedContext.params.record.record_type});

      if (!profiler) {
        return cb('no_context_sepcifier');
      }
      var builtQuery = Mustache.render(profiler.query_template, record);
      passedContext.context_display = Mustache.render(profiler.display_template, record);

      // Retrieve documents matching the query
      retrieveDocuments(builtQuery, cb);
    }
  ], function(err, datas) {
    if (err || err === 'no_context_sepcifier') {
      console.log(err);
      return res.send(500);
    }

    res.render('app/context.html', {
      context: passedContext,
      documents: datas
    });
  });
};

/**
 * Show full document
 */
module.exports.show = function(req, res) {
  //TODO: handle err
  retrieveDocument(req.params.documentId, function(err, datas) {

    res.render('canvas/show.html', {
      document: datas
    });

  });
};
