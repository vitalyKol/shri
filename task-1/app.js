var data = [
    {
        type: 1,
        number: 120,
        company: 'Аэрофлот',
        logo: 'http://www.ljplus.ru/img4/f/e/fencer_dv/aeroflot-logo2.png',
        aircraft: 'aerobus'
    }
];

$(document).ready(function () {

    // init sticky header
    if (!isStickySupported()) {
        $('table').stickyTableHeaders();
    }

    // setup even rows
    $('table tbody tr:visible:even').addClass('even');

    $('[name=type]').on('change', function () {
        setTimeout(function () {
            $('table tbody tr').removeClass('even');
            $('table tbody tr:visible:even').addClass('even');
        }, 0);
    });

});

function isStickySupported () {
    var property = 'position',
        value = 'sticky',
        el = document.createElement('test'),
        mStyle = el.style;

    mStyle.cssText = property + ':' + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + property + ':') + value + ';';

    return mStyle[property].indexOf(value) !== -1;
}