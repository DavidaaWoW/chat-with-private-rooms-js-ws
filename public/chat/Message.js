import hasInterfaceElements from "./hasInterfaceElements.js";

class Message extends hasInterfaceElements{
    constructor(last_user = '', interfaceElements, slug) {
        super(interfaceElements, slug);
        this.last_user = last_user;
    }

    alert_msg = (message) => {
        const chat_window = this.getInterfaceElementByName(this.slug["chat_messages_slug"]);
        const msg = document.createElement('div');
        msg.classList.add('msg-type-1');
        msg.innerHTML = message;
        chat_window.append(msg);
        this.scroll_to_end();
    }

    outcoming_msg = (message) => {
        const chat_window = this.getInterfaceElementByName(this.slug["chat_messages_slug"]);
        const msg = document.createElement('div');
        msg.classList.add('msg-type-3');
        msg.innerHTML = message;
        chat_window.append(msg);
        this.scroll_to_end();
    }

    incoming_msg = (message) => {
        const chat_window = this.getInterfaceElementByName(this.slug["chat_messages_slug"]);
        const msg = document.createElement('div');
        msg.classList.add('msg-type-2');
        msg.innerHTML = message;
        chat_window.append(msg);
        this.scroll_to_end();
    }

    chat_msg = (txt, user, personal = false ) => {
        const chat_window = this.getInterfaceElementByName(this.slug["chat_messages_slug"]);
        const msg = document.createElement('div');
        msg.classList.add('msg');
        if (personal) msg.classList.add('personal');
        if (this.last_user == user) msg.classList.add('same-user');
        msg.innerHTML = `<div class="msg-usr">${user}</div><div class="msg-body">${txt}</div>`;
        chat_window.append(msg);
        this.last_user = user;
        this.scroll_to_end();
    }

    info_msg = (txt) => {
        const chat_window = this.getInterfaceElementByName(this.slug["chat_messages_slug"]);
        const msg = document.createElement('div');
        msg.classList.add('msg');
        msg.classList.add('info');
        chat_window.append(msg);
        msg.innerText = txt;
        this.scroll_to_end();
    }

    scroll_to_end = () => {
        console.log('scroll');
        const chat_body = this.getInterfaceElementByName(this.slug["chat_body_slug"]);;
        chat_body.scrollTop = chat_body.scrollHeight;
    }
}

export default Message;