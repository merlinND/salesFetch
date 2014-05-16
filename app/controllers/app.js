/**
 * Salesfoce Canvas controller
 */
'use strict';

var anyfetchHelpers = require('../helpers/anyfetch.js');
var _ = require("lodash");

/**
 * Display Context page
 */
module.exports.contextSearch = function(req, res, next) {
  var reqParams = req.reqParams;

  if(!reqParams.context || !reqParams.context.templatedQuery || !reqParams.context.templatedDisplay) {
    return next(new Error('Check your context profiler configuration, a template is missing.'));
  }

  var params = {
    sort: '-creationDate',
    search: reqParams.context.templatedQuery
  };


  var filters;
  if (req.query.filters) {
    filters = JSON.parse(req.query.filters);
    params = _.merge(params, filters);
  }

  anyfetchHelpers.findDocuments(reqParams.anyFetchURL, params, function(err, documents) {
    if (err) {
      return next(err);
    }

    res.render('app/context.html', {
      data: reqParams,
      documents: documents,
      filters: filters
    });
  });
};

/**
 * Show full document
 */
module.exports.documentDisplay = function(req, res, next) {
  anyfetchHelpers.findDocument(reqParams.anyFetchURL, req.params.id, function(err, document) {
    if(err) {
      return next(err);
    }

    res.render('app/show.html', {
      data: reqParams,
      document: document
    });
  });
};

/**
 * Display list of all providers
 */
module.exports.listProviders = function(req, res, next) {
  anyfetchHelpers.getProviders(function(err, providers) {
    if (err) {
      return next(err);
    }

    res.render('app/providers.html', {
      providers: providers
    });
  });
};

/**
 * Redirect the user on the connection page
 */
module.exports.connectProvider = function(req, res, next) {
  if (!req.query.app_id) {
    return next(new Error('Missing app_id query string.'));
  }

  var connectUrl = 'http://settings.anyfetch.com/connect/provider?app_id=' + req.query.app_id + '&token=' + req.user.anyFetchToken;
  res.redirect(connectUrl);
};