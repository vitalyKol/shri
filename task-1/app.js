$(document).ready(function () {

    data.forEach(function (item) {
        $('table tbody').append($(rowTemplate(item)));
    });

    //if (!isStickySupported()) {
        $('table').stickyTableHeaders();
    //}

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
        el = document.createElement('div'),
        elStyle = el.style;

    elStyle.cssText = property + ':' + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + property + ':') + value + ';';

    return elStyle[property].indexOf(value) !== -1;
}

function rowTemplate (item) {
    return '<tr class="' + item.type + '">\
                <td class="board__item--type" style="background-image: url(img/' + item.type + '.png);"></td>\
                <td class="board__item--number">\
                    <a href="#flight' + item.number + '">' + item.number + '</a>\
                    <div class="popup" id="flight' + item.number + '">' + popupTemplate(item) + '</div>\
                </td>\
                <td class="board__item--company">' + item.company + '</td>\
                <td class="board__item--logo"><img src="img/' + item.logo + '.png" /></td>\
                <td class="board__item--aircraft">\
                    <span data-full="' + item.aircraft_full + '" data-short="' + item.aircraft_short + '"></span>\
                </td>\
                <td class="board__item--destination">' + item.destination + '</td>\
                <td class="board__item--time">' + item.time + '</td>\
                <td class="board__item--status">' + item.status + '</td>\
                <td class="board__item--comment">' + item.comment + '</td>\
            </tr>';
}

function popupTemplate (item) {
    var type = (item.type == 'arrival') ? 'прибытие' : 'отправление';

    return '<a href="#" class="popup__overlay"></a>\
            <div class="popup__content">\
                <h2>\
                    <span class="red">И</span>нформация о рейсе № ' + item.number + '\
                    <img src="img/' + item.type + '.png" width="30" />\
                </h2>\
                <div><img src="img/' + item.logo + '.png" /></div>\
                <a href="#" class="popup__close">Закрыть</a>\
                <ul class="params-list">\
                    <li>\
                        <span class="params-list__title">Тип рейса:</span>\
                        <span class="params-list__value">' + type + '</span>\
                    </li>\
                    <li>\
                        <span class="params-list__title">Авиакомпания:</span>\
                        <span class="params-list__value">' + item.company + '</span>\
                    </li>\
                    <li>\
                        <span class="params-list__title">Тип воздушного судна:</span>\
                        <span class="params-list__value">' + item.aircraft_full + '</span>\
                    </li>\
                    <li>\
                        <span class="params-list__title">Аэропорт назначения:</span>\
                        <span class="params-list__value">' + item.destination + '</span>\
                    </li>\
                    <li>\
                        <span class="params-list__title">Время по расписанию:</span>\
                        <span class="params-list__value">' + item.time + '</span>\
                    </li>\
                    <li>\
                        <span class="params-list__title">Статус рейса:</span>\
                        <span class="params-list__value">' + item.status + '</span>\
                    </li>\
                    <li>\
                        <span class="params-list__title">Примечание:</span>\
                        <span class="params-list__value">' + item.comment + '</span>\
                    </li>\
                </ul>\
            </div>'
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
    }
];