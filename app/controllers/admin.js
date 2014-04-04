/**
 * Administration controller
 */
'use strict';

var async = require('async');
var SFDChelper = require('../helpers/salesforce');


/**
 * Administration index page
 * Display the context profilers settings
 */
module.exports.index = function(req, res) {
  SFDChelper.getContextProfilers(req.reqParams, function(err, contextProfilers) {
    if(err) {
      console.log(err);
    }

    res.render('admin/index.html', {
      organization: req.organization,
      contextProfilers: contextProfilers,
      data: req.reqParams
    });
  });
};


/**
 * Display a form to create a nex context profiler
 */
module.exports.newContextProfiler = function(req, res) {
  SFDChelper.avaibleSObjectsForContextProfilers(req.reqParams, function(err, sObjects) {
    res.render('admin/new.html', {
      objects: sObjects,
      data: req.reqParams
    });
  });
};


/**
 * Create a new context profiler based on the POST body
 */
module.exports.createContextProfiler = function(req, res, next) {
  var newContextProfiler = req.body;
  newContextProfiler.name = newContextProfiler.sFetch_test__Record_Type__c;

  async.waterfall([
    function createCP(cb) {
      SFDChelper.createContextProfiler(req.reqParams, newContextProfiler, cb);
    }, function sendEmptyReturn(_, cb) {
      res.send(204);
      return cb(null);
    }
  ], next);
};


/**
 * Delete the selected context profiler
 * Redirect to index if the context profiler is effectively removed
 */
module.exports.deleteContextProfiler = function(req, res) {
  var profilerId = req.params.contextProfilerId;

  SFDChelper.deleteContextProfiler( req.reqParams, profilerId, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }

    res.redirect(302,'/admin?data=' + encodeURIComponent(JSON.stringify(req.reqParams)) );
  });
};


/**
 * Delete the selected context profiler
 * Redirect to index if the context profiler is effectively removed
 */
module.exports.createContextPage = function(req, res, next) {
  var isMobile = req.query.mobile || false;
  var profilerId = req.params.contextProfilerId;

  async.waterfall([
    function(cb) {
      SFDChelper.createContextPage( req.reqParams, profilerId, isMobile, cb);
    }, function() {
      return res.redirect(302,'/admin?data=' + encodeURIComponent(JSON.stringify(req.reqParams)) );
    }
  ], next);
};
