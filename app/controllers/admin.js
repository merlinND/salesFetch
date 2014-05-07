/**
 * Administration controller
 */
'use strict';

var anyFetchHelper = require('../helpers/anyfetch');

/**
 * Create a subcompany and add an admin user
 * Called on time at package installation
 */
module.exports.init = function(req, res, next) {
  if (!req.user || !req.organization) {
    return next(new Error('The init account should provide user and org informations'));
  }

  anyFetchHelper.initAccount(req, function(err, createdOrg) {
    if (err) {
      return next(err);
    }

    res.send(createdOrg.masterKey);
  });
};

/**
 * Administration index page
 * Display the context profilers settings
 */
module.exports.index = function(req, res) {
  res.render('admin/index.html', {
    organization: req.organization,
    data: req.reqParams
  });
};