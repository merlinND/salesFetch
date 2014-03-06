/**
 * Salesfoce Canvas controller
 */
'use strict';

var async = require('async');
var Mustache = require('mustache');
var jsforce = require('jsforce');
var _ = require('lodash');
var mongoose = require('mongoose');

var anyfetchHelpers = require('../helpers/anyfetch.js');
var Organization = mongoose.model('Organization');


/**
 * Display Context page
 */
module.exports.contextSearch = function(req, res) {
  var context = req.session.context;
  var record;
  var profiler;

  async.waterfall([
    function retrieveContext(cb) {
      var conn = new jsforce.Connection({
        instanceUrl : context.instance_url,
        accessToken : context.oauth_token
      });

      conn
        .sobject(context.params.record.object_type)
        .retrieve(context.params.record.record_id, cb);
    },
    function retrieveProfiler(_record, cb) {
      record = _record;
      Organization.findOne({_id: req.session.user.organization}, cb);
    },
    function retrieveContextProfiler(org, cb) {
      if (!org) {
        return cb(new Error("No matching organization"));
      }

      cb(null, org.context_profilers);
    },
    function buildQuery(contextProfilers, cb) {
      var profiler = _.find(contextProfilers, {object_type: context.params.record.record_type});

      if (!profiler) {
        return cb('no_context_sepcifier');
      }
      var search = Mustache.render(profiler.query_template, record);
      context.context_display = Mustache.render(profiler.display_template, record);

      // Retrieve documents matching the query
      anyfetchHelpers.findDocuments({search: search}, cb);
    }
  ], function(err, datas) {
    if (err) {
      return res.send(500, err);
    }

    res.render('app/context.html', {
      context: context,
      documents: datas
    });
  });
};

/**
 * Show full document
 */
module.exports.documentDisplay = function(req, res) {
  //TODO: handle err
  anyfetchHelpers.findDocument(req.params.documentId, function(err, datas) {

    res.render('canvas/show.html', {
      document: datas
    });

  });
};
