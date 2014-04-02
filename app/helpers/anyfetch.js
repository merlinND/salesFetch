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


  var batchParams = pages.map(encodeURIComponent).join('&pages=');
  baseRequest(url, '/batch?pages=' + batchParams, function(err, res) {

    if (err) {
      return cb(err);
    }

    var body = res.body;

    var documentTypes = body[pages[0]];
    var providers = body[pages[1]];
    var docReturn = body[pages[2]];

    if (!docReturn.datas) {
      return cb(null, docReturn);
    }

    // Render the datas templated
    docReturn.datas.forEach(function(doc) {
      var relatedTemplate = documentTypes[doc.document_type].template_snippet;
      doc.snippet_rendered = Mustache.render(relatedTemplate, doc.datas);

      doc.provider = providers[doc.token].name;
      doc.document_type = documentTypes[doc.document_type].name;
    });

    // Return all the documents types
    for (var docType in docReturn.document_types) {
      if (docType) {
        docReturn.document_types[docType] = documentTypes[docType];
      }
    }

    // Return all the providers
    docReturn.providers = {};
    for (var provider in docReturn.tokens) {
      if (provider) {
        docReturn.providers[provider] = providers[provider];
      }
    }

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
