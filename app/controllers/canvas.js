/**
 * Salesfoce Canvas controller
 */
'use strict';

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
  res.render('canvas/timeline.ect', {
    user: req.user
  });
};

module.exports = function(req, res) {
  var params = req.context.environment.parameters;

  if(params.mode === "search") {
    displaySearch(req, res);
  } else {
    displayContext(req, res);
  }
};