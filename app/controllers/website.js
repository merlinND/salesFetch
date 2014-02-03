'use strict';

module.exports = function(req, res) {
  res.render('layouts/website.ejs', {
    users: [],
    title: "EJS example",
    header: "Some users"
  });
};
