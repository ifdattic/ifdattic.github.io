(function (window, document, undefined) {

  'use strict';

  /**
   * Nav
   */
  var nav = document.querySelector('.nav-reveal');

  var device = function () {
    return 'ontouchstart' in window ? 'touchstart' : 'click';
  };
  var toggleNav = function (event) {
    this.parentNode.setAttribute('data-state', this.parentNode.getAttribute('data-state') === 'open' ? 'closed' : 'open');
    event.preventDefault();
  };
  nav.addEventListener(device(), toggleNav, false);

})( window, document);

$(document).ready(function () {
  $(window).on('scroll.socialite', function () {
    Socialite.load();
    $(window).off('scroll.socialite');
  });


  $('[data-ga-event]').on('click', function (e) {
    var eventData = this.dataset.gaEvent.split(',');

    ga('send', 'event', eventData[0], eventData[1], eventData[2]);
  });
});
