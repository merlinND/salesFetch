/**
 * Administration controller
 */
'use strict';

var async = require('async');
var jsforce = require('jsforce');
var _ = require('lodash');
var mongoose = require('mongoose'),
    Organization = mongoose.model('Organization');

var retrieveSObject = function(passedContext, cb) {
  // Retrive the context object
  var conn = new jsforce.Connection({
    instanceUrl : passedContext.instance_url,
    accessToken : passedContext.oauth_token
  });
  conn.describeGlobal(function(err, data) {
    if (err) {
      return cb(err);
    }

    var availableObjects = _.where(data.sobjects, {'layoutable': true, 'activateable': false});
    cb(null, availableObjects);
  });
};

module.exports.index = function(req, res) {
  Organization.findOne({_id: req.session.user.organization}, function(err, org) {
    if (err || !org || !org.context_profilers) {
      return res.send(500);
    }
    console.log(req.session.context);
    res.render('admin/index.html', {
      profilers: org.context_profilers
    });
  });
};

module.exports.newContextProfiler = function(req, res) {
  retrieveSObject(req.session.context, function(err, objects) {
    res.render('admin/new.html', {
      objects: objects
    });
  });
};

module.exports.createContextProfiler = function(req, res) {
  var newContextProfiler = req.body;
  async.waterfall([
    function(cb) {
      Organization.findOne({_id: req.session.user.organization}, cb);
    }, function(org, cb) {
      org.context_profilers.push(newContextProfiler);
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

    var contextProfiler = org.context_profilers.id(req.params.contextProfilerId);

    if (!contextProfiler) {
      res.send(500);
    }

    res.render('admin/edit.html', {
      data: contextProfiler
    });
  });
};

module.exports.deleteContextProfiler = function(req, res) {
  var profilerId = req.params.contextProfilerId;
  Organization.update({_id: req.session.user.organization}, {'$pull':{context_profilers: {_id: profilerId}}}, function(err) {
    if (err) {
      console.log(err);
    }

    return res.redirect(302,'/admin');
  });
};