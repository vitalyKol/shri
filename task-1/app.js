$(document).ready(function () {

    // get data
    data.forEach(function (item) {
        $('table tbody').append($(rowTemplate(item)));
    });

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

function rowTemplate (item) {
    return '<tr class="' + item.type + '">\
                <td class="type" style="background-image: url(img/' + item.type + '.png);"></td>\
                <td>\
                    <a href="#flight' + item.number + '">' + item.number + '</a>\
                    <div class="popup" id="flight' + item.number + '">\
                        <div class="popup-content">\
                            ' + popupTemplate(item) + '\
                            <a href="#" class="close">Закрыть</a>\
                        </div>\
                    </div>\
                </td>\
                <td class="company">' + item.company + '</td>\
                <td class="logo"><img src="img/' + item.logo + '.png" /></td>\
                <td class="aircraft">\
                    <span data-full="' + item.aircraft_full + '" data-short="' + item.aircraft_short + '"></span>\
                </td>\
                <td>' + item.destination + '</td>\
                <td>' + item.time + '</td>\
                <td>' + item.status + '</td>\
                <td>' + item.comment + '</td>\
            </tr>';
}

function popupTemplate (item) {
    return '<ul>\
                <li>\
                    <span class="popup-item-title">Тип рейса:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Номер рейса:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Авиакомпания:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Логотип:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Тип воздушного судна:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Аэропорт назначения:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Время по расписанию:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Статус рейса:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
                <li>\
                    <span class="popup-item-title">Примечание:</span>\
                    <span class="popup-item-value">item.</span>\
                </li>\
            </ul>'
}

var data = [
    {
        type: 'arrival',
        number: 4430,
        company: 'Аэрофлот',
        logo: 'aeroflot',
        aircraft_full: 'Boeing 737-800',
        aircraft_short: 'B737',
        destination: 'Екатеринбург',
        time: '00:42',
        status: 'по расписанию',
        comment: 'информация будет доступна позже'
    }, {
        type: 'arrival',
        number: 1245,
        company: 'Аэрофлот',
        logo: 'aeroflot',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Челябинск',
        time: '00:44',
        status: 'по расписанию',
        comment: 'информация будет доступна позже'
    }, {
        type: 'departure',
        number: 4254,
        company: 'Трансаэро',
        logo: 'transaero',
        aircraft_full: 'ATR 72-500',
        aircraft_short: 'ATR72',
        destination: 'Москва',
        time: '00:46',
        status: 'посадка закончена',
        comment: 'информация будет доступна позже'
    }, {
        type: 'arrival',
        number: 3116,
        company: 'Turkish Airlines',
        logo: 'turkish_airlines',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Анталия',
        time: '00:48',
        status: 'задерживается до 02:45',
        comment: 'информация будет доступна позже'
    }, {
        type: 'departure',
        number: 7813,
        company: 'Трансаэро',
        logo: 'transaero',
        aircraft_full: 'ATR 72-500',
        aircraft_short: 'ATR72',
        destination: 'Санкт-Петербург',
        time: '00:52',
        status: 'ожидание посадки',
        comment: 'информация будет доступна позже'
    }, {
        type: 'departure',
        number: 4125,
        company: 'Turkish Airlines',
        logo: 'turkish_airlines',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Анталия',
        time: '00:56',
        status: 'регистрация',
        comment: 'информация будет доступна позже'
    }, {
        type: 'arrival',
        number: 1245,
        company: 'Аэрофлот',
        logo: 'aeroflot',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Новый Уренгой',
        time: '01:01',
        status: 'по расписанию',
        comment: 'информация будет доступна позже'
    }, {
        type: 'arrival',
        number: 4430,
        company: 'Аэрофлот',
        logo: 'aeroflot',
        aircraft_full: 'Boeing 737-800',
        aircraft_short: 'B737',
        destination: 'Екатеринбург',
        time: '00:42',
        status: 'по расписанию',
        comment: 'информация будет доступна позже'
    }, {
        type: 'arrival',
        number: 1245,
        company: 'Аэрофлот',
        logo: 'aeroflot',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Челябинск',
        time: '00:44',
        status: 'по расписанию',
        comment: 'информация будет доступна позже'
    }, {
        type: 'departure',
        number: 4254,
        company: 'Трансаэро',
        logo: 'transaero',
        aircraft_full: 'ATR 72-500',
        aircraft_short: 'ATR72',
        destination: 'Москва',
        time: '00:46',
        status: 'посадка закончена',
        comment: 'информация будет доступна позже'
    }, {
        type: 'arrival',
        number: 3116,
        company: 'Turkish Airlines',
        logo: 'turkish_airlines',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Анталия',
        time: '00:48',
        status: 'задерживается до 02:45',
        comment: 'информация будет доступна позже'
    }, {
        type: 'departure',
        number: 7813,
        company: 'Трансаэро',
        logo: 'transaero',
        aircraft_full: 'ATR 72-500',
        aircraft_short: 'ATR72',
        destination: 'Санкт-Петербург',
        time: '00:52',
        status: 'ожидание посадки',
        comment: 'информация будет доступна позже'
    }, {
        type: 'departure',
        number: 4125,
        company: 'Turkish Airlines',
        logo: 'turkish_airlines',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Анталия',
        time: '00:56',
        status: 'регистрация',
        comment: 'информация будет доступна позже'
    }, {
        type: 'arrival',
        number: 1245,
        company: 'Аэрофлот',
        logo: 'aeroflot',
        aircraft_full: 'Boeing 777-200',
        aircraft_short: 'B777',
        destination: 'Новый Уренгой',
        time: '01:01',
        status: 'по расписанию',
        comment: 'информация будет доступна позже'
    },
];