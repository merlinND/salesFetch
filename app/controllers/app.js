/**
 * Salesfoce Canvas controller
 */
'use strict';

var anyfetchHelpers = require('../helpers/anyfetch.js');

/**
 * Display Context page
 */
module.exports.contextSearch = function(req, res, next) {
  var data = req.data;

  var params = {
    sort: '-creationDate',
    search: data.context['templated-query']
  };

  anyfetchHelpers.findDocuments(data['anyfetch-api-url'], params, function(err, documents) {
    if (err) {
      return next(err);
    }

    res.render('app/context.html', {
      data: data,
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
