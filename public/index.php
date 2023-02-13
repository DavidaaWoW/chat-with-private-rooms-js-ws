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
<section class="chat-wrapper container-fluid row" id="chat-main">
<!--    <div class="chat-body">-->
<!--        <div id="chat-messages"></div>-->
<!--        <div id="the-input" contenteditable="true">Напишите что-нибудь...</div>-->
<!--        <div id="send-msg">Отправить</div>-->
<!--    </div>-->
    <div class="col" id="status-window">
        <li class="row global-chat">
            <div class="status"></div>
            <div class="name left_bar_usernameglobal">Общий чат</div>
            <div class="notification">
                <div class="not-off notificationGlobal"></div>
            </div>
        </li>
        <h1>Пользователи в сети</h1>
        <ul class="col" id="users-bar">

        </ul>
    </div>
    <div class="chat-window col-10">
        <div class="status-bar row">
            <div class="back-btn">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
                </div>
            </div>
            <div class="name-label">
                <div class="status-bulb" style="color: green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="8"/>
                    </svg>
                </div>
                <div class="status-name"></div>
            </div>
            <div class="option-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </div>
        </div>
        <div class="row-6" id="chat-messages">
        </div>
        <div class="send-message row">
            <div class="attachment">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                </svg>
            </div>
            <div contenteditable="true" class="" id="msg-input">Напишите что-нибудь...</div>
            <button class="btn btn-success" id="send-btn">Отправить</button>
        </div>
    </div>

</section>
</body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="socket.js" type="module"></script>
</html>
