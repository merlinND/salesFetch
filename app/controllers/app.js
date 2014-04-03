/**
 * Salesfoce Canvas controller
 */
'use strict';

var anyfetchHelpers = require('../helpers/anyfetch.js');

/**
 * Display Context page
 */
module.exports.contextSearch = function(req, res, next) {
  var reqParams = req.reqParams;

  if(!reqParams.context || !reqParams.context.templatedQuery || !reqParams.context.templatedDisplay) {
    return next({message: 'Check your context profiler configuration, a template is missing.'});
  }

  var params = {
    sort: '-creationDate',
    search: reqParams.context.templatedQuery
  };

  anyfetchHelpers.findDocuments(reqParams.anyFetchURL, params, function(err, documents) {
    if (err) {
      return next(err);
    }

    res.render('app/context.html', {
      data: reqParams,
      documents: documents
    });
  });
};

/**
 * Show full document
 */
module.exports.documentDisplay = function(req, res, next) {
  var reqParams = req.reqParams;

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
