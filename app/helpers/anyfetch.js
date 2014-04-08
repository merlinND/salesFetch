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
    docReturn.document_types = {};
    for (var docType in docReturn.facets.document_types) {
      if (docType) {
        var dT = {
          id: docType,
          count: docReturn.facets.document_types[docType],
          name: documentTypes[docType].name
        };

        docReturn.document_types[docType] = dT;
      }
    }

    // Return all the providers
    docReturn.providers = {};
    for (var provider in docReturn.facets.tokens) {
      if (provider) {
        var p = {
          id: provider,
          count: docReturn.facets.tokens[provider],
          name: providers[provider].name
        };

        docReturn.providers[provider] = p;
      }
    }

    // Result number
    docReturn.count = 0;
    for(var token in docReturn.facets.tokens) {
      docReturn.count += docReturn.facets.tokens[token];
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
