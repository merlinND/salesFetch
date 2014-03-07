/**
 * Administration controller
 */
'use strict';

var async = require('async');
var jsforce = require('jsforce');
var _ = require('lodash');
var fs = require('fs');
var Mustache = require('mustache');
var mongoose = require('mongoose'),
    Organization = mongoose.model('Organization');

// Load in cache template for Salesforce context page
var contextPageTemplate = fs.readFileSync(__dirname + '/../views/apex/context-page-template.apex', 'utf8');

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
 * Return a completed template with the actual context profiler
 */
var createVisualforceContextPage = function(contextProfilers) {
  contextProfilers.forEach(function(contextProfiler) {
    contextProfiler.page = Mustache.render(contextPageTemplate, contextProfiler);
  });
  return contextProfilers;
};

/**
 * Administration index page
 * Display the context profilers settings
 */
module.exports.index = function(req, res) {
  Organization.findOne({_id: req.session.user.organization}, function(err, org) {
    if (err || !org || !org.contextProfilers) {
      return res.send(500);
    }

    var contextProfilers = createVisualforceContextPage(org.contextProfilers);

    res.render('admin/index.html', {
      profilers: contextProfilers
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

module.exports.editContextProfiler = function(req, res) {
  Organization.findOne({_id: req.session.user.organization}, function(err, org) {
    if (err || !org) {
      res.send(500, err);
    }

    var contextProfiler = org.contextProfilers.id(req.params.contextProfilerId);

    if (!contextProfiler) {
      res.send(500);
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
  Organization.findOne({_id: req.session.user.organization}, function(err, org) {
    if (err) {
      return res.send(500);
    }
    if (!org.contextProfilers.id(profilerId)) {
      return res.send(404);
    }

    org.contextProfilers.id(profilerId).remove();
    org.save(function(err) {
      if (err) {
        return res.send(500);
      }

      res.redirect(302,'/admin');
    });
  });
};
