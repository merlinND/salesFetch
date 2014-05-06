'use strict';

var request = require('superagent');
var Mustache = require('mustache');


var baseRequest = function(url, endpoint, cb) {
  var urlToCall = url + endpoint;
  return request.get(urlToCall)
    .set('Authorization', 'Basic ' + process.env.FETCHAPI_CREDS)
    .end(function(e, r) {cb(e,r);});
};


module.exports.findDocuments = function(url, params, cb) {
  var query = [];
  for(var key in params) {
    query.push(key + "=" + encodeURIComponent(params[key]));
  }

  var pages = [
    '/document_types',
    '/providers',
    '/documents?' + query.join('&')
  ];

  console.log(pages);

  var batchParams = pages.map(encodeURIComponent).join('&pages=');
  var batchUrl = '/batch?pages=' + batchParams;
  baseRequest(url, batchUrl, function(err, res) {

    if (err) {
      return cb(err);
    }

    var body = res.body;

    var documentTypes = body[pages[0]];
    var providers = body[pages[1]];
    var docReturn = body[pages[2]];



    cb(null, docReturn);
  });
};

module.exports.findDocument = function(url, id, cb) {
  var pages = [
    '/document_types',
    '/providers',
    '/documents/' + id
  ];

  var batchParams = pages.map(encodeURIComponent).join('&pages=');
  baseRequest(url, '/batch?pages=' + batchParams, function(err, res) {
    if (err) {
      return cb(err);
    }

    var body = res.body;

    var documentTypes = body[pages[0]];
    var providers = body[pages[1]];
    var docReturn = body[pages[2]];

    var relatedTemplate = documentTypes[docReturn.document_type].template_full;
    var titleTemplate = documentTypes[docReturn.document_type].template_title;

    docReturn.full_rendered = Mustache.render(relatedTemplate, docReturn.datas);
    docReturn.title_rendered = Mustache.render(titleTemplate, docReturn.datas);

    docReturn.provider = providers[docReturn.token].name;
    docReturn.document_type = documentTypes[docReturn.document_type].name;

    cb(null, docReturn);
  });
};
