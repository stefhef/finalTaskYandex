# Краткое описание:
* Есть сайт работающий по адресу http://localhost:3000/
* Есть база данных PostheSQL:
    - Пользователь: *admin*
    - Пароль: *root*
    - Имя базы данных: main 
    - Порт: 5432
    - Адрес: localhost
* Есть сервер обрабатывающий запросы с фронта. Он работает по адресу http://localhost:8080/

Связь между фронтом и бэком обеспечивается с использованием GraphQL

В целом после перезапуска всё продолжить работать как обычно, хотя скорее всего серверы упадут при потере связи с базой данных.

На фронте состояние примеров обновляется каждые 15 секунд
## Время выполнения арифметических операций
* Сложение: 0,1 секунды
* Вычитание: 0,5 секунд
* Умножение, деление, взятие остатка, модуль, синус, косинус, тангенс, катангенс: 1 секунда
* Факториал: 10 секунд

## Как запустить
Запуск происходит через файл docker-compose
>docker compose -f "docker-compose.yml" up -d --build
При первом запуске может не заработать контейнер worker, после перезапуска он начинает свою работу

тг: https://t.me/StepanMwlnicov