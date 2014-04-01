'use strict';

var attachedViewer = null;
var data = window.data;

var goToLocation = function(window, url) {
  var urlWithDatas = url + "?data=" + encodeURIComponent(JSON.stringify(data));
  window.location = urlWithDatas;
};

var displayFull = function(url) {
  if (!attachedViewer) {
    // Create a new viewer and display the right Url
    attachedViewer = window.open(null,"_blank","toolbar=yes, scrollbars=yes, resizable=yes, width=800, height=1000");
    attachedViewer.document.write('loading...');
    goToLocation(attachedViewer, url);

    var interval = window.setInterval(function() {
        try {
          if (attachedViewer === null || attachedViewer.closed) {
            window.clearInterval(interval);
            attachedViewer = null;
          }
        }
        catch (e) {
        }
      }, 200);
  } else {
    attachedViewer.document.write('loading...');
    goToLocation(attachedViewer, url);
    attachedViewer.focus();
  }
};


/**
 * Open documents URL in custom window
 */
$(function() {
  var isViewer = window.opener ? true : false;
  var isOnMobile = data.env.deviceType === "mobile";

  // Handle the full preview loading
  $("[data-document-url]").click(function(e) {
    e.preventDefault();

    var url = $(this).data("documentUrl");
    if (isOnMobile) {
      goToLocation(window, url);
    } else if (!isViewer) {
      displayFull(url);
    }
  });
});



/**
 * Change url connection
 */
$(function() {
  $("[data-admin-url]").click(function(e) {
    e.preventDefault();

    var url = $(this).data("adminUrl");
    goToLocation(window, url);
  });
});

$(function() {
  $("#form").submit(function(e) {
    e.preventDefault();
    var url = $("#form").attr("action") + "?data=" + encodeURIComponent(JSON.stringify(data));

    $.post(url, $("#form").serialize(), function(data) {
      if(data.success) {
        goToLocation(window, '/admin');
      }
    });
  });
});

/**
 * Add custom back button on SF iframe.
 */
$(function() {
  // Previous page button
  var isOnMobile = data.env.deviceType === "mobile";
  if (isOnMobile && $(".back-btn")) {
    $(".back-btn").removeClass("hidden");
  }
  $(".back-btn").click(function(e) {
    e.preventDefault();
    history.back();
  });
});


/**
 * Toggle "Filters"
 */
$(function() {
  $('#toggle-filters').click(function(e) {
    e.preventDefault();

    $('#filters-container').toggle();
  });
});

/**
 * Display the right size for pdf viewer
 */
$(function() {
  var getPdfZoom = function() {
    var containerWidth = $('#page-container').width();
    $('[data-page-no]').each(function() {
      var pageWidth = $(this).width();
      var ratio = containerWidth / pageWidth - 0.005;
      $(this).css("zoom", ratio);
      $(this).css("-moz-transform", ratio);
    });
  };

  if ($('#page-container')) {
    $( window ).resize(function() {
      getPdfZoom();
    });

    getPdfZoom();
  }
});
