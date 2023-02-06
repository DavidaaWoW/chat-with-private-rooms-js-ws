import hasInterfaceElements from "./hasInterfaceElements.js";

class Chat extends hasInterfaceElements{

    constructor(URL, interfaceElements, cookies, slug, io, messages) {
        super(interfaceElements, slug);
        this.URL = URL;
        this.cookies = cookies;
        this.io = io;
        this.messages = messages;
    }

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
        } else {
            name_input_overlay.classList.add('is-visible');
        }

        const input = this.getInterfaceElementByName(this.slug["message_input_slug"]);
        input.addEventListener('focus', function(){ this.classList.add('is-focused'); });
        input.addEventListener('blur', function(){ this.classList.remove('is-focused'); });
    }

    chat_functions_init(socket, name) {

        this.chat_actions(socket);

        socket
            .on('connect', () => {
                console.log('Подключен!');
            })
            .on('welcome', (data) => {
                this.messages.info_msg(`Добро пожаловать!`);
            })
            .on('new user', data => {
                this.messages.info_msg(`Новый пользователь - ${data.name}`);
            })
            .on('message', data => {
                const is_personal = data.name == name;
                this.messages.chat_msg(data.msg, data.name, is_personal);
            })
            .on('leaved', data => {
                this.messages.info_msg(`${data.name} Покинул чат`);
            })
            .on('disconnect', () => {
                this.messages.info_msg(`Вы были отключены от чата`);
            });
    }

    emitMessage = (socket) => {
        const message_input = this.getInterfaceElementByName(this.slug["message_input_slug"]);
        const message = message_input.textContent;
        if (!message) return false;
        message_input.textContent = '';
        socket.emit('message', message);
    }

    chat_actions(socket) {
        const message_input = this.getInterfaceElementByName(this.slug["message_input_slug"]);

        const msg_send_btn = this.getInterfaceElementByName(this.slug["message_send_button_slug"]);

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