/**
 * Salesfoce Canvas controller
 */
'use strict';

var anyfetchHelpers = require('../helpers/anyfetch.js');



/**
 * Display Context page
 */
module.exports.contextSearch = function(req, res, next) {
  var context = req.data;

  var params = {
    sort: '-creationDate',
    search: context.context['templated-query']
  };

  anyfetchHelpers.findDocuments(context['anyfetch-api-url'], params, function(err, datas) {
    if (err) {
      return next(err);
    }

    res.render('app/context.html', {
      query: req.query,
      context: context,
      documents: datas
    });
  });
};

/**
 * Show full document
 */
module.exports.documentDisplay = function(req, res, next) {
  anyfetchHelpers.findDocument(req.params.id, function(err, document) {
    if(err) {
      return next(err);
    }
    res.render('app/show.html', {
      document: document
    });
  });
};
