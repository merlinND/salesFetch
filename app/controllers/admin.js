/**
 * Administration controller
 */
'use strict';

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
 * Redirect to /index if work
 */
module.exports.createContextProfiler = function(req, res) {
  var newContextProfiler = req.body;
  newContextProfiler.name = newContextProfiler.sFetch_test__Record_Type__c;

  SFDChelper.createContextProfiler(req.reqParams, newContextProfiler, function(err) {
    if(err) {
      console.log(err);
      return res.send(500);
    }

    res.send(200);
  });
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
