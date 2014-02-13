'use strict';

$( ".snippet-container a" ).click(function(e) {
  e.preventDefault();
  window.open($(this)[0].href,"_blank","toolbar=yes, scrollbars=yes, resizable=yes, fullscreen=yes");
});