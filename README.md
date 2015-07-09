# Школа разработки интерфейсов 2015
Тестовые задания для Школы разработки интерфейсов

# Задание №1
Сверстайте табло аэропорта. На нём должны быть представлены следующие данные:

* тип рейса (вылет/прилёт; например это может быть иконка);
* номер рейса;
* авиакомпания;
* логотип авиакомпании;
* тип воздушного судна;
* аэропорт назначения;
* плановое время вылета или прилёта;
* статус рейса (для вылетающих: регистрация, ожидание посадки, посадка закончена, вылетел; для прилетающих: по расписанию, летит, приземлился; для всех: задерживается до HH:MM, отменён);
* примечание (например, информация о код-шеринге с другими авиакомпаниями).
В качестве источника можно использовать данные онлайн-табло любого аэропорта мира.
Дизайн оформления выберите на своё усмотрение, при этом необходимо реализовать следующее:

* по наведению курсора на определённое место в табло контрастным цветом выделяются соответствующие строка и столбец;
* нечётные строки табло темнее чётных;
* количество отображаемых данных по высоте больше ширины экрана, при прокрутке заголовок таблицы приклеивается к верхней части видимой области окна браузера;
* при изменении ширины экрана браузера в табло автоматически скрываются и/или сокращаются значения наименее важных столбцов (например, при ширине 1000 пикселей вы показываете всю таблицу, при ширине 900 пикселей — убираете название авиакомпании, оставляя только логотип, 800 пикселей — сокращаете название воздушного судна (Boeing 737-800 -> B737) и так далее);
* в дополнение к предыдущему пункту сделайте так, чтобы по клику на соответствующую строчку в выплывающем окне показывались все данные рейса;
* два чекбокса над самим табло: прилёт и вылет, по нажатию показываются только соответствующие рейсы.

# Задание №2
Существует API, которое умеет отвечать по трём URL: /countries, /cities и /populations. Клиентское приложение подсчитывает численность населения в Африке. Запросы друг от друга не зависят. Чтобы браузер пользователя не простаивал, клиентскому приложению важно уметь делать все три запроса одновременно. Реализацией API является функция getData(url, callback), которая принимает строку с URL запроса и функцию обратного вызова. В случае ошибки в callback первым аргументом будет передана строка ошибки, в случае успеха вторым аргументом будет передан ответ API.

Вам досталась реализация клиентского приложения, которое должно решать описанную выше задачу. Но в коде приложения есть ошибки, из-за которых фактический результат работы отличается от ожидаемого. Сам код [`здесь`](https://gist.github.com/verkholantsev/4d14ce053b009dac1225).

**Как должно быть**: приложение выводит в консоль суммарную популяцию в Африке.
**Как на самом деле**: приложение не выводит в консоль ничего.

**Задание**

* Найдите ошибку в коде приложения, из-за которой реальный результат работы отличается от ожидаемого. Опишите, как эта ошибка могла возникнуть и как её избежать в будущем.
* Добавьте в приложение новую возможность — диалог с пользователем. Приложение спрашивает название страны или города, а затем показывает численность населения. Для диалога можно использовать window.prompt.

**Решение**
* Во внешнем цикле запросов к API объявленная переменная `i` продолжает существовать во время вызовов метода `getData`. К моменту первого вызова цикл уже проходит, и переменная `i` становится равной 3, а значение переменной `var request = requests[i]` становится равным `'/populations'`. Задача решается с помощью замыкания, путем создания копии текущего значения переменной `request` в локальной области видимости функции обратного вызова.
```
for (i = 0; i < 3; i++) {
    var request = requests[i];

    var callback = (function (req) {
        return function (error, result) {
            ...
        }
    })(request);
 
    getData(request, callback);
}
```

* [`Ссылка`](http://chudinov.info/shri/task-2) на рабочий пример.