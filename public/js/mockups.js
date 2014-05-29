'use strict';

$("#filter").popover({
  placement : 'bottom',
  html: true,
  container: 'body',
  content : $('#filter-popover').html()
});

$('#left-toogle').click(function() {
  $("#left-panel").toggleClass('active');
});