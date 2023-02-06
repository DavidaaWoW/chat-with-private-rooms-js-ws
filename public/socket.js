import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import Chat from "./chat/Chat.js";
import Cookies from "./chat/Cookie.js";
import Messages from "./chat/Message.js";

const cookies = new Cookies();

const URL = "http://localhost:3001";

const interfaceElements = {
    chat_main_window: document.getElementById('chat-main'),
    chat_name_overlay: document.getElementById('overlay-name-input'),
    message_input: document.getElementById('the-input'),
    chat_name_input: document.getElementById('name-input'),
    chat_name_button: document.getElementById('accept-username'),
    invalid_nickname: document.getElementById('invalid-nickname'),
    message_send_button: document.getElementById('send-msg'),
    chat_window: document.getElementById('chat-messages'),
    chat_body: document.querySelector('.chat-body')
}

const slug = {
    "main_window_slug": "chat_main_window",
    "name_overlay_slug": "chat_name_overlay",
    "message_input_slug": "message_input",
    "name_input_slug": "chat_name_input",
    "name_button_slug": "chat_name_button",
    "invalid_nickname_slug": "invalid_nickname",
    "message_send_button_slug": "message_send_button",
    "chat_messages_slug": "chat_window",
    "chat_body_slug": "chat_body"
}

const messages = new Messages('', interfaceElements, slug);
let chat = new Chat(URL, interfaceElements, cookies, slug, io, messages);
chat.initialize();
