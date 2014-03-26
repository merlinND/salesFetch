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

  var params = {
    sort: '-creationDate',
    search: reqParams.templatedQuery
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
  var data = req.data;

  anyfetchHelpers.findDocument(data['anyfetch-api-url'], req.params.id, function(err, document) {
    if(err) {
      return next(err);
    }
    res.render('app/show.html', {
      data: data,
      document: document
    });
  });
};
