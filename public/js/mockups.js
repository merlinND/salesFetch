'use strict';

/*===============
  COMMON
 ================*/

/**
 * Popover filet
 */
$("#filter").popover({
  placement : 'bottom',
  html: true,
  container: '.navbar',
  content : $('#filter-popover').html()
});

/**
 * Switch mode
 */
$('#context-switch a').click(function() {
  $("#context-switch a").removeClass('btn-primary');
  $("#context-switch a").addClass('btn-default');
  $(this).addClass('btn-primary');
  $(this).removeClass('btn-default');
});

/*===============
  TABLET
 ================*/

/**
 * Toogle left panel
 */
$('#left-toogle').click(function() {
  $("#left-panel").toggleClass('active');
});

/**
 * Hide left bar on click snippet
 */
$('.snippet').click(function(e) {
  e.preventDefault();
  $("#left-panel").removeClass('active');
});



/*===============
  MOBILE
 ================*/
/**
 * Show navbar on scroll-down and hide-it on scroll-up
 */
if (!$('#left-panel').length) {
  var navbarHeight = $('.navbar').height();
  var lastPostion = 0;

  var isPopoverActive = false;

  $('#filter').on('hidden.bs.popover', function () {
    isPopoverActive = false;
  });

  $('#filter').on('shown.bs.popover', function () {
    isPopoverActive = true;
  });

  $(window).scroll(function() {
    var newPosition = $(window).scrollTop();
    var toBottom =  newPosition - lastPostion > 0;

    if ((newPosition > navbarHeight)) {
      $('.navbar').addClass('navbar-hidden');
      $('.navbar').addClass('navbar-fixed');
    }

    if (!toBottom && (newPosition > navbarHeight)) {
      $('.navbar').removeClass('navbar-hidden');
      $('.navbar').addClass('navbar-fixed');
    } else if(toBottom && (newPosition > navbarHeight) && !isPopoverActive) {
      $('.navbar').addClass('navbar-hidden');
    } else if(newPosition === 0) {
      $('.navbar').removeClass('navbar-fixed');
    }

    lastPostion = $(window).scrollTop();
  });
}