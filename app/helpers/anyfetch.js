'use strict';

var async = require('async');
var request = require('superagent');
var Mustache = require('mustache');


var baseRequest = function(endpoint, method, url) {
  return request[method](endpoint + url).set('Authorization', 'Basic ' + process.env.FETCHAPI_CREDS);
};


module.exports.findDocuments = function(url, params, cb) {
  async.parallel([
    function loadDocumentTypes(cb) {
      baseRequest(url, 'get', '/')
        .end(function(e, r) {cb(e,r);});
    },
    function loadDocuments(cb) {
      baseRequest(url, 'get', '/documents')
        .query(params)
        .end(function(e, r) {cb(e,r);});
    }
  ],
  function(err, data){
    if (err) {
      return cb(err);
    }

    var rootReturn = data[0].body;
    var docReturn = data[1].body;


    if (!docReturn.datas) {
      return cb(null, docReturn);
    }

    // Render the datas templated
    docReturn.datas.forEach(function(doc) {
      var relatedTemplate = rootReturn.document_types[doc.document_type].template_snippet;
      doc.snippet_rendered = Mustache.render(relatedTemplate, doc.datas);

      doc.provider = rootReturn.provider_status[doc.token].name;
      doc.document_type = rootReturn.document_types[doc.document_type].name;
    });

    // Return all the documents types
    for (var docType in docReturn.document_types) {
      if (docType) {
        docReturn.document_types[docType] = rootReturn.document_types[docType];
      }
    }

    // Return all the providers
    docReturn.providers = {};
    for (var provider in docReturn.tokens) {
      if (provider) {
        docReturn.providers[provider] = rootReturn.provider_status[provider];
      }
    }

    cb(null, docReturn);
  });
};

module.exports.findDocument = function(id, cb) {
  async.parallel([
    function(cb) {
      baseRequest('get', '/').end(function(e, r) { cb(e,r);});
    },
    function(cb) {
      baseRequest('get', '/documents/' + id).end(function(e, r) { cb(e,r);});
    }
  ],
  function(err, data) {
    if (err) {
      return cb(err);
    }

    var rootReturn = data[0].body;
    var docReturn = data[1].body;

    var relatedTemplate = rootReturn.document_types[docReturn.document_type].template_full;
    var titleTemplate = rootReturn.document_types[docReturn.document_type].template_title;

    docReturn.full_rendered = Mustache.render(relatedTemplate, docReturn.datas);
    docReturn.title_rendered = Mustache.render(titleTemplate, docReturn.datas);

    docReturn.provider = rootReturn.provider_status[docReturn.token].name;
    docReturn.document_type = rootReturn.document_types[docReturn.document_type].name;

    cb(null, docReturn);
  });
};
