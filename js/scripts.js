$(document).ready(function () {

    "use strict";

    // Mobile Toggle

    $('.mobile-toggle').click(function () {
        $('nav').toggleClass('open-nav');
    });

    $('[data-ga-event]').on('click', function (e) {
        var eventData = this.dataset.gaEvent.split(',');

        ga('send', 'event', eventData[0], eventData[1], eventData[2]);
    });
});
