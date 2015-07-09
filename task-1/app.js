var data = [
    {
        type: 1,
        number: 120,
        company: 'Аэрофлот',
        logo: 'http://www.ljplus.ru/img4/f/e/fencer_dv/aeroflot-logo2.png',
        aircraft: 'aerobus'
    }
];

$(document).ready(function() {

    var stickyNavTop = $('table thead').offset().top,
        element = null;

    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();

        if (scrollTop > stickyNavTop) {
            if (!element) { element = $('table thead').clone(true).appendTo($('table')).addClass('sticky'); }
        } else {
            element && element.remove();
            element = null;
        }
    };

    stickyNav();

    $(window).scroll(function() {
        stickyNav();
    });


});