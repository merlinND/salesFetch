/**
 * Salesfoce Canvas controller
 */
'use strict';

var request = require('request');

var retrieveDocuments = function(query, cb) {
  var queryParams = {
    'search': query
  };

  request({
    url: 'http://api.anyfetch.com/documents',
    headers: {'Authorization': 'Basic ' + process.env.FETCHAPI_CREDS},
    qs: queryParams
  }, function(err, response, body) {
    cb(err, body);
  });
};

/*
 * Display Search page
 */
var displaySearch = function(req, res) {
  res.render('canvas/search.ect', {
    user: req.user
  });
};

/*
 * Display specific context
 */
var displayContext = function(req, res) {
  var params = req.context.environment.parameters;

  retrieveDocuments(params.record.query, function(err, doc) {
    res.render('canvas/timeline.ect', {
      user: req.user,
      documents: doc.data
    });
  });
};

module.exports = function(req, res) {
  console.log(req.session)
  req.session.count = req.session.count + 1 || 0;
  var params = req.context.environment.parameters;

  if(params.mode === "search") {
    displaySearch(req, res);
  } else {
    displayContext(req, res);
  }
};