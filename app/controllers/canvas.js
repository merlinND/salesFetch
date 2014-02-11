/**
 * Salesfoce Canvas controller
 */
'use strict';


/*
 * Display Search page
 */
var displaySearch = function(req, res) {
  res.render('canvas/search.html', {
    user: req.user
  });
};

/*
 * Display specific context
 */
var displayContext = function(req, res) {
  var params = req.session.context.environment.parameters;
  res.render('canvas/timeline.html', {
    creds: process.env.FETCHAPI_CREDS,
    context: params.record
  });
};

module.exports = function(req, res) {
  var params = req.session.context.environment.parameters;

  if(params.mode === "search") {
    displaySearch(req, res);
  } else {
    displayContext(req, res);
  }
};