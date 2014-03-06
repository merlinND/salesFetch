/**
 * Administration controller
 */
'use strict';

var mongoose = require('mongoose'),
    Organization = mongoose.model('Organization');

module.exports.index = function(req, res) {
  Organization.findOne({_id: req.session.user.organization}, function(err, org) {
    if (err || !org || !org.context_profilers) {
      return res.send(500);
    }

    res.render('admin/index.html', {
      profilers: org.context_profilers
    });
  });
};

module.exports.newContextProfiler = function(req, res) {
  res.render('admin/new.html');
};

module.exports.createContextProfiler = function(req, res) {
  var newContextProfiler = req.body;
  console.log(newContextProfiler);
  Organization.update({_id: req.session.user.organization}, {'$push':{context_profilers: newContextProfiler}}, {upsert:true}, function(err) {
    if (err) {
      console.log(err);
    }

    return res.redirect(302,'/admin');
  });
};

module.exports.editContextProfiler = function(req, res) {

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