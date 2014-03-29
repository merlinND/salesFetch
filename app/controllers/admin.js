/**
 * Administration controller
 */
'use strict';

var async = require('async');
var jsforce = require('jsforce');
var _ = require('lodash');
var mongoose = require('mongoose');
var Organization = mongoose.model('Organization');
var User = mongoose.model('User');

/**
 * Retrieve Salesforce Object acessible on the current account
 */
var retrieveSObject = function(instanceUrl, oauthToken, cb) {
  // Retrive the context object
  var conn = new jsforce.Connection({
    instanceUrl : instanceUrl,
    accessToken : oauthToken,
  });
  conn.describeGlobal(function(err, data) {
    if (err) {
      return cb(err);
    }

    var availableObjects = _.where(data.sobjects, {'layoutable': true, 'activateable': false});
    cb(null, availableObjects);
  });
};

/**
 * Administration index page
 * Display the context profilers settings
 */
module.exports.index = function(req, res) {
  var contextProfilers;
  async.waterfall([
    function getContextProfiler(cb) {
      var conn = new jsforce.Connection({
        instanceUrl : req.reqParams.instanceURL,
        accessToken : req.reqParams.sessionId,
      });

      conn.sobject("sFetch_test__Context_Profiler__c")
        .select("*")
        .execute(cb);
    }, function getCountUser(cp, cb) {
      contextProfilers = cp;

      User.count({organization: req.organization._id}, cb);
    }
  ], function(err, count) {
    res.render('admin/index.html', {
      userCount: count,
      organization: req.organization,
      contextProfilers: contextProfilers
    });
  });
};

/**
 * Display a form to create a nex context profiler
 */
module.exports.newContextProfiler = function(req, res) {
  retrieveSObject(req.session.instanceUrl, req.session.oauthToken, function(err, objects) {
    res.render('admin/new.html', {
      objects: objects
    });
  });
};

/**
 * Create a new context profiler based on the POST body
 * Redirect to /index if work
 */
module.exports.createContextProfiler = function(req, res) {
  var newContextProfiler = req.body;
  async.waterfall([
    function(cb) {
      Organization.findOne({_id: req.session.user.organization}, cb);
    }, function(org, cb) {
      org.contextProfilers.push(newContextProfiler);
      org.save(cb);
    }
  ], function(err) {
    if (err) {
      return res.render('admin/new.html', {
        err: err,
        data: newContextProfiler
      });
    }

    return res.redirect(302,'/admin');
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
module.exports.deleteContextProfiler = function(req, res, next) {
  var profilerId = req.params.contextProfilerId;
  Organization.findOne({_id: req.session.user.organization}, function(err, org) {
    if (err) {
      return next(err);
    }
    if (!org.contextProfilers.id(profilerId)) {
      return next({
        error: new Error("Context profiler not found."),
        status: 404
      });
    }

    org.contextProfilers.id(profilerId).remove();
    org.save(function(err) {
      if (err) {
        return next(err);
      }

      res.redirect(302,'/admin');
    });
  });
};
