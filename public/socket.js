import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import Chat from "./chat/Chat.js";
import Cookies from "./chat/Cookie.js";
import Messages from "./chat/Message.js";
import LeftBar from "./chat/LeftBar.js";

const cookies = new Cookies();

const URL = "http://localhost:3001";

// const interfaceElements = {
//     chat_main_window: document.getElementById('chat-main'),
//     chat_name_overlay: document.getElementById('overlay-name-input'),
//     message_input: document.getElementById('the-input'),
//     chat_name_input: document.getElementById('name-input'),
//     chat_name_button: document.getElementById('accept-username'),
//     invalid_nickname: document.getElementById('invalid-nickname'),
//     message_send_button: document.getElementById('send-msg'),
//     chat_window: document.getElementById('chat-messages'),
//     chat_body: document.querySelector('.chat-body')
// }

const interfaceElements = {
    chat_main_window: document.getElementById('chat-main'),
    chat_name_overlay: document.getElementById('overlay-name-input'),
    message_input: document.getElementById('msg-input'),
    chat_name_input: document.getElementById('name-input'),
    chat_name_button: document.getElementById('accept-username'),
    invalid_nickname: document.getElementById('invalid-nickname'),
    message_send_button: document.getElementById('send-btn'),
    chat_window: document.getElementById('chat-messages'),
    chat_body: document.querySelector('.chat-window'),
    left_bar: document.getElementById('users-bar'),
    status_name: document.querySelector('.status-name'),
    global_chat: document.querySelector('.global-chat'),
    status_bulb: document.querySelector('.status-bulb')
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
    "chat_body_slug": "chat_body",
    "left_bar_slug": "left_bar",
    'left_bar_user_status_slug': 'left_bar_user_status',
    'left_bar_username_slug': 'left_bar_username',
    'status_name_slug': 'status_name',
    'global_chat_slug': 'global_chat',
    'central_bar_status_bulb_slug': 'status_bulb'
}

const messages = new Messages('', interfaceElements, slug);
const leftBar = new LeftBar(interfaceElements, slug, cookies);
const chat = new Chat(URL, interfaceElements, cookies, slug, io, messages, leftBar);
chat.initialize();
