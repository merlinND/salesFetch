'use strict';

$("#filter").popover({
  placement : 'bottom',
  html: true,
  container: 'body',
  content : $('#filter-popover').html()
});