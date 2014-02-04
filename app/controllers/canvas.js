/**
 * Canvas controller
 */
'use strict';

var displaySearch = function(req, res) {
  res.render('canvas/timeline.ect', {
    user: req.user
  });
};

var displayContext = function(req, res) {
  res.render('canvas/timeline.ect', {
    user: req.user
  });
};

module.exports = function(req, res) {
  var params = req.context.environment.parameters;

  if(params.indexOf("search") !== -1) {
    displaySearch(req, res);
  } else {
    displayContext(req, res);
  }
};