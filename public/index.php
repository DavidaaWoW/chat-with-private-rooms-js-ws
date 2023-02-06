<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">

    <title>Chat</title>
</head>
<body>
<div id="overlay-name-input">
    <input type="text" id="name-input" placeholder="Введите Ваше имя" >
    <div class="btn btn--light" id="accept-username">Войти</div>
</div>
<section class="chat-wrapper" id="chat-main">
    <div class="chat-body">
        <div id="chat-messages"></div>
        <div id="the-input" contenteditable="true">Напишите что-нибудь...</div>
        <div id="send-msg">Отправить</div>
    </div>
    <!-- <div class="chat-status">
        <div class="personal-info">
            <div class="userpic"></div>
            <div class="userinfo"></div>
        </div>
        <div class="surroundings"></div>
    </div> -->
</section>

<!--<div class="container">-->
<!--    <div class="py-5 text-center">-->
<!--        <h2>Чат программа</h2>-->
<!--        <p class="lead">Укажите ваше имя и начинайте переписку</p>-->
<!--    </div>-->
<!--    <div class="row">-->
<!--        <div class="col-6">-->
<!--            <!-- Форма для получения сообщений и имени -->-->
<!--            <h3>Форма сообщений</h3>-->
<!--            <form id="messForm">-->
<!--                <label for="name">Имя</label>-->
<!--                <input type="text" name="name" id="name" placeholder="Введите имя" class="form-control">-->
<!--                <br>-->
<!--                <label for="message">Сообщение</label>-->
<!--                <textarea name="message" id="message" class="form-control" placeholder="Введите сообщение"></textarea>-->
<!--                <br>-->
<!--                <input type="submit" value="Отправить" class="btn btn-danger">-->
<!--            </form>-->
<!--        </div>-->
<!--        <div class="col-6">-->
<!--            <h3>Сообщения</h3>-->
<!--            <!-- Вывод всех сообщений будет здесь -->-->
<!--            <div id="all_mess"></div>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->
</body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="socket.js" type="module"></script>
</html>
