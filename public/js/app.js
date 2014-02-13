'use strict';

var viewer = null;
var isViewer = window.opener ? true : false;

var displayFull = function(url) {
  if (!viewer) {
    viewer = window.open(url,"_blank","toolbar=yes, scrollbars=yes, resizable=yes, width=800, height=1000");
    var interval = window.setInterval(function() {
        try {
          if (viewer === null || viewer.closed) {
            window.clearInterval(interval);
            viewer = null;
          }
        }
        catch (e) {
        }
      }, 200);
  } else {
    viewer.location = url;
    viewer.focus();
  }
};

$( ".snippet-container a" ).click(function(e) {
  if (!isViewer) {
    e.preventDefault();

    displayFull($(this)[0].href);
  }
});