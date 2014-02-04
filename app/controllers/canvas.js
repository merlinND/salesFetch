/**
 * Canvas controller
 */
'use strict';

module.exports = function(req, res) {
  res.render('canvas/timeline.ect', {
    user: req.user
  });
};