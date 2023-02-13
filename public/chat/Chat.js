import hasInterfaceElements from "./hasInterfaceElements.js";

class Chat extends hasInterfaceElements{

    constructor(URL, interfaceElements, cookies, slug, io, messages, leftBar) {
        super(interfaceElements, slug);
        this.URL = URL;
        this.cookies = cookies;
        this.io = io;
        this.messages = messages;
        this.leftBar = leftBar;
    }

    chat_receiver = 'global';
    initialize(){
        const chat_main_window = this.getInterfaceElementByName(this.slug["main_window_slug"]);
        const chat_name_overlay = this.getInterfaceElementByName(this.slug["name_overlay_slug"]);
        if (chat_main_window) this.chat_init();
        if (chat_name_overlay) this.waitForUsername();
    }

    waitForUsername(){
        const chat_name_input = this.getInterfaceElementByName(this.slug["name_input_slug"]);
        const chat_name_button = this.getInterfaceElementByName(this.slug["name_button_slug"]);

        chat_name_button.addEventListener('click', function() {
            const nickname = chat_name_input.value;
            if (!nickname) {
                const invalid_nickname = this.getInterfaceElementByName(this.slug["invalid_nickname_slug"]);
                invalid_nickname.classList.add('show');
                setTimeout(()=>{
                    invalid_nickname.classList.remove('show');
                },5000);
                return false;
            }

            this.cookies.setCookie('username', nickname);
            this.chat_init();
        }.bind(this), false);
    }

    chat_init() {
        // Включаем socket.io и отслеживаем все подключения
        let socket;
        const name = this.cookies.getCookie('username');

        const name_input_overlay = this.getInterfaceElementByName(this.slug["name_overlay_slug"]);
        const chat_main_window = this.getInterfaceElementByName(this.slug["main_window_slug"]);


        if (name) {
            chat_main_window.classList.add('is-visible');
            name_input_overlay.classList.remove('is-visible');
            socket = this.io(this.URL, { query : {
                    username: name
                }});
            this.chat_functions_init(socket, name);
            this.getChatMessages(name, this.chat_receiver, socket);
        } else {
            name_input_overlay.classList.add('is-visible');
        }

        const input = this.getInterfaceElementByName(this.slug["message_input_slug"]);
        const status_name = this.getInterfaceElementByName(this.slug["status_name_slug"]);
        const name_cookie = this.cookies.getCookie('chat-receiver');
        if(name_cookie) {
            status_name.innerHTML = name_cookie == "global" ? "Общий чат" : name_cookie;
            this.chat_receiver = name_cookie;
            if (name_cookie!=='global'){
                const centralStatusBulb = this.getInterfaceElementByName(this.slug["central_bar_status_bulb_slug"]);
                centralStatusBulb.style.color = this.cookies.getCookie('receiver-status-color');

            }
        }
        input.addEventListener('focus', function(){ this.classList.add('is-focused'); });
        input.addEventListener('blur', function(){ this.classList.remove('is-focused'); });
    }

    getUsers(socket, name){
        socket.emit('getUsers', {user: name});
    }

    getChatMessages(sender, receiver, socket){
        socket.emit('getChatMessages', sender, receiver);
    }

    openChat(sender, receiver){
        const status_name = this.getInterfaceElementByName(this.slug["status_name_slug"]);
        const receiver_name = receiver.name !== "global" ? receiver.name : "global";
        const centralStatusBulb = this.getInterfaceElementByName(this.slug["central_bar_status_bulb_slug"]);
        const chat_window = this.getInterfaceElementByName(this.slug["chat_messages_slug"]);
        chat_window.innerHTML = '';

        if(receiver_name !== 'global'){
            centralStatusBulb.style.color = receiver.status ? 'green' : 'grey';
            this.cookies.setCookie('receiver-status-color', centralStatusBulb.style.color);
        }
        status_name.innerHTML = receiver.name === "global" ? "Общий чат" : receiver_name;
        this.cookies.setCookie('chat-receiver', receiver_name);
        this.chat_receiver = receiver_name;
    }

    placeMessages(data, name){
        data.forEach(message => {
            if(name === message.name){
                this.messages.outcoming_msg(message.message_text);
            }
            else {
                this.messages.incoming_msg(message.message_text);
            }
        });
    }

    chat_functions_init(socket, name) {

        this.chat_actions(socket, name);
        this.getUsers(socket, name);

        socket
            .on('connect', () => {
                console.log('Подключен!');
                this.getChatMessages(name, this.chat_receiver, socket);
            })
            .on('welcome', (data) => {
                if (this.chat_receiver === 'global')
                this.messages.alert_msg(`Добро пожаловать!`);
            })
            .on('new user', data => {
                if (this.chat_receiver === 'global')
                    this.messages.info_msg(`Новый пользователь - ${data.name}`);
            })
            .on('message', data => {
                const is_personal = data.name == name;
                this.messages.chat_msg(data.msg, data.name, is_personal);
            })
            .on('leaved', data => {
                if (this.chat_receiver === 'global')
                    this.messages.alert_msg(`${data.name} Покинул чат`);
            })
            .on('disconnect', () => {
                if (this.chat_receiver === 'global')
                    this.messages.alert_msg(`Вы были отключены от чата`);
            })
            .on('users', data => {
                this.leftBar.barInit(data, socket, name);
            })
            .on('user connected', data => {
                this.leftBar.changeUserStatus(data.name, true);
            })
            .on('user disconnected', data => {
                this.leftBar.changeUserStatus(data.name, false);
            })
            .on('open chat', data => {
                this.openChat(data.sender, data.receiver);
                this.getChatMessages(data.sender.name, data.receiver.name, socket);
            })
            .on('message received', data => {
                if(this.chat_receiver === data.sender && data.receiver === 'private' ||
                    this.chat_receiver === "global" && data.receiver === 'global') {
                    this.messages.incoming_msg(data.message);
                } else{
                    this.leftBar.messageNotification(data.sender, data.receiver);
                }
            })
            .on('messages synched', data => {
                this.placeMessages(data, name);
            });
    }


    emitMessage = (socket) => {
        const message_input = this.getInterfaceElementByName(this.slug["message_input_slug"]);
        const message = message_input.textContent;
        if (!message) return false;
        message_input.textContent = '';
        socket.emit('message-private', {message: message, receiver: this.chat_receiver});
        this.messages.outcoming_msg(message);
    }


    chat_actions(socket, name) {
        const message_input = this.getInterfaceElementByName(this.slug["message_input_slug"]);
        const msg_send_btn = this.getInterfaceElementByName(this.slug["message_send_button_slug"]);
        const global_chat = this.getInterfaceElementByName(this.slug["global_chat_slug"]);
        const global_not = document.querySelector('.notificationGlobal');

        message_input.addEventListener('focus', function(){ if (this.textContent == 'Напишите что-нибудь...') this.textContent = ''; });
        message_input.addEventListener('blur', function(){ if (!this.textContent) this.textContent = 'Напишите что-нибудь...'; });
        message_input.addEventListener('keydown', function(e){
            if (e.code == 'Enter') {
                this.emitMessage(socket);
            }
            return false;
        }.bind(this), false);

        msg_send_btn.addEventListener('click', function(e){
            this.emitMessage(socket);
        }.bind(this), false);

        global_chat.addEventListener('click', (e) => {
            global_not.classList.remove('not-on');
            global_not.classList.add('not-off');
            socket.emit('getChat', {sender: name, receiver: 'global'});
        });

    }

    chat_msg = (txt, user, personal = false ) => {
    const msg = document.createElement('div');
    msg.classList.add('msg');
    if (personal) msg.classList.add('personal');
    if (messages.last_user == user) msg.classList.add('same-user');
    msg.innerHTML = `<div class="msg-usr">${user}</div><div class="msg-body">${txt}</div>`;
    messages.chat_window.append(msg);
    messages.last_user = user;
    messages.scroll_to_end();
    }

}

export default Chat;