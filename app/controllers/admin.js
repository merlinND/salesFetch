/**
 * Administration controller
 */
'use strict';

var async = require('async');
var jsforce = require('jsforce');
var _ = require('lodash');
var mongoose = require('mongoose');
var Organization = mongoose.model('Organization');

/**
 * Retrieve Salesforce Object acessible on the current account
 */
var retrieveAvailableSObject = function(params, cb) {
  var conn = new jsforce.Connection({
    instanceUrl : params.instanceURL,
    accessToken : params.sessionId,
  });

  async.parallel([
    function retrieveObject(cb) {
      conn.describeGlobal(function(err, data) {
        if (err) {
          return cb(err);
        }

        var availableObjects = _.where(data.sobjects, {'layoutable': true, 'activateable': false});
        cb(null, availableObjects);
      });
    }, function getAllContextProfilers(cb) {
      conn.sobject("sFetch_test__Context_Profiler__c")
        .select("*")
        .execute(cb);
    }
  ], function(err, data) {
    if(err) {
      console.log(err);
    }

    var allObj = data[0];
    var existingCP = data[1];

    existingCP.forEach(function(cP) {
      var found = false;

      for (var i = 0; i < allObj.length && !found; i++) {
        if (allObj[i].name === cP.sFetch_test__Record_Type__c) {
          found = true;
          allObj.splice(i,1);
        }
      }

    });
    
    cb(null, allObj);
  });
};

/**
 * Administration index page
 * Display the context profilers settings
 */
module.exports.index = function(req, res) {
  async.waterfall([
    function getContextProfiler(cb) {
      var conn = new jsforce.Connection({
        instanceUrl : req.reqParams.instanceURL,
        accessToken : req.reqParams.sessionId,
      });

      conn.sobject("sFetch_test__Context_Profiler__c")
        .select("*")
        .execute(cb);
    }
  ], function(err, contextProfilers) {

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
  retrieveAvailableSObject(req.reqParams, function(err, objects) {
    res.render('admin/new.html', {
      objects: objects,
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

  async.waterfall([
    function(cb) {
      var conn = new jsforce.Connection({
        instanceUrl : req.reqParams.instanceURL,
        accessToken : req.reqParams.sessionId,
      });

      conn.sobject("sFetch_test__Context_Profiler__c")
        .create(newContextProfiler, cb);
    }
  ], function(err, ret) {
    console.log(ret);

    if (err || !ret.success) {
      return res.render('admin/new.html', {
        err: err || ret,
        data: newContextProfiler
      });
    }

    return res.send({sucess: true});
  });
};

module.exports.editContextProfiler = function(req, res, next) {
  Organization.findOne({_id: req.session.user.organization}, function(err, org) {
    if (err || !org) {
      return next(err);
    }

    var contextProfiler = org.contextProfilers.id(req.params.contextProfilerId);

    if (!contextProfiler) {
      return next(new Error("No context profiler."));
    }

    res.render('admin/edit.html', {
      data: contextProfiler
    });
  });
};

/**
 * Delete the selected context profiler
 * Redirect to index if the context profiler is effectively removed
 */
module.exports.deleteContextProfiler = function(req, res) {
  var profilerId = req.params.contextProfilerId;
  var conn = new jsforce.Connection({
    instanceUrl : req.reqParams.instanceURL,
    accessToken : req.reqParams.sessionId,
  });

  conn.sobject("sFetch_test__Context_Profiler__c").destroy(profilerId, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }

    res.redirect(302,'/admin?data=' + encodeURIComponent(JSON.stringify(req.reqParams)) );
  });
};
