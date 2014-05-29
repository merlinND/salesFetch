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

$('#context-switch a').click(function() {
  $("#context-switch a").removeClass('btn-primary');
  $("#context-switch a").addClass('btn-default');
  $(this).addClass('btn-primary');
  $(this).removeClass('btn-default');
});