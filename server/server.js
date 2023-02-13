const path = require("path");
const express = require("express");
const http = require("http");
const mysql = require("mysql2");


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "chattest",
    password: "1",
});

const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));

const io = require("socket.io")(server, {
    cors: {
        origin: "http://chat-app",
    },
});

function uniqueid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
};

let total = 0;

let users = [];

async function getUsers() {
    users = [];
    await pool.promise().query("select * from users").then((data) => {
        data.forEach(value => users.push(value));
    });
}

async function addUser(username, socket_id) {
    pool.query("insert into users (name, status, socket_id) values ('" + username + "', true, '" + socket_id + "')");
    getUsers();
}

async function checkForUsername(username) {
    return pool.promise().query("select * from users where name = '" + username + "'").then((data) => {
        return !data[0].length;
    });
}

async function getUserByUsername(username) {
    return pool.promise().query("select * from users where name = '" + username + "'").then((data) => {
        return data[0][0];
    });
}

async function updateUserSocketId(socketId, username) {
    return pool.promise().query("update users set socket_id = '" + socketId + "' where name = '" + username + "'").then((data) => {
        getUsers();
        return true;
    });
}

async function updateUserStatus(username, status) {
    return pool.promise().query("update users set status = " + status + " where name = '" + username + "'").then((data) => {
        getUsers();
        return true;
    });
}

async function onGetUsers(maxTries, data, socket) {
    if (!maxTries) return false
    try {
        const newUsernames = [];
        users[0].forEach((username) => {
            if (username.name != data.user) {
                newUsernames.push(username);
            }
        });
        socket.emit('users', {users: newUsernames});
        return true;
    } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await onGetUsers(maxTries - 1, data, socket);
    }
}

async function checkChatExistence(sender, receiver) {
    return pool.promise().query(
        "select ch1.chat_id\n" +
        "from chat_user ch1\n" +
        "join chat_user ch2 using (chat_id)\n" +
        "where ch1.user_id = " + sender + " and ch2.user_id = " + receiver)
        .then(data => {
            return !!data[0].length;
        });
}

async function getChat(sender, receiver) {
    return pool.promise().query(
        "select ch1.chat_id\n" +
        "from chat_user ch1\n" +
        "join chat_user ch2 using (chat_id)\n" +
        "where ch1.user_id = " + sender + " and ch2.user_id = " + receiver)
        .then(data => {
            return data[0];
        });
}

async function createChat(sender, receiver) {
    const id = uniqueid();
    return pool.promise().query(
        "insert into chats (id) values ('" + id + "')"
    ).then(() => {
        pool.promise().query(
            "insert into chat_user (user_id, chat_id) values (" + sender + ", '" + id + "')"
        ).then(() => {
            pool.promise().query(
                "insert into chat_user (user_id, chat_id) values (" + receiver + ", '" + id + "')"
            ).then(() => {return true});
        });
    });
}


async function createMessage(sender_, receiver_, message){
    getUserByUsername(sender_).then(sender => {
        getUserByUsername(receiver_).then(receiver => {
            getChat(sender.id, receiver.id).then(chat_id => {
                pool.promise().query(
                    "insert into messages (chat_id, message_text, sender_id) values ('" + chat_id[0].chat_id + "', '" + message + "', " + sender.id + ")"
                );
            });
        });
    });
}

async function getChatMessages(chat, socket){
    pool.promise().query(
        "select messages.*, users.name from messages join users on users.id=messages.sender_id where messages.chat_id = '" + chat + "' order by messages.sent_date"
    ).then((data) => {
        socket.emit('messages synched', data[0]);
    });
}

io.sockets.on("connection", (socket) => {
    console.log("Успешное соединение");

    socket.emit("welcome", "welcome man");


    const handshake = socket.handshake.query;
    if (!handshake.username) {
        setTimeout(() => socket.disconnect(true), 1);
    } else {
        total++;
        socket.username = handshake.username;
        // Если true, значит пользователя в БД не существует
        checkForUsername(socket.username).then((usernameStatus) => {
            if (usernameStatus) {
                addUser(socket.username, socket.id);
                socket.broadcast.emit('new user', {name: socket.username, total});
            } else {
                updateUserSocketId(socket.id, socket.username);
                updateUserStatus(socket.username, true);
                socket.broadcast.emit('user connected', {name: socket.username});
            }
        });
        console.log(socket.username);
    }

    socket.on('getUsers', (data) => {
        onGetUsers(10, data, socket).then(result => {
        });
    });

    socket.on('getChat', (data) => {

        getUserByUsername(data.sender).then(sender => {
            if(data.receiver === 'global'){
                socket.emit('open chat', {sender: sender, receiver: {name: "global"}});
                return;
            }
            getUserByUsername(data.receiver).then(receiver => {
                checkChatExistence(sender.id, receiver.id).then(existence => {
                    if (existence) {

                    } else {
                        createChat(sender.id, receiver.id);
                    }
                    socket.emit('open chat', {sender: sender, receiver: receiver});
                });
            });
        });
    });

    socket.on('message-private', (data) => {
        if(data.receiver === 'global'){
            socket.broadcast.emit('message received', {sender: socket.username, message: data.message, receiver: 'global'});
            return;
        }
        createMessage(socket.username, data.receiver, data.message).then(() => {
            getUserByUsername(data.receiver).then(user => {
               socket.to(user.socket_id).emit('message received', {sender: socket.username, message: data.message, receiver: 'private'});
            });
        });
    });

    socket.on('getChatMessages', (sender_, receiver_) => {
       if(receiver_!=='global'){
           getUserByUsername(sender_).then(sender => {
               getUserByUsername(receiver_).then(receiver => {
                   getChat(sender.id, receiver.id).then(chat_id => {
                        getChatMessages(chat_id[0].chat_id, socket);
                   });
               });
           });
       }
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.emit('message', {name: socket.username, msg: data});
        socket.broadcast.emit('message', {name: socket.username, msg: data});
    });


    socket.on('disconnect', () => {
        console.log('disconnect', socket.username);
        total--;
        updateUserStatus(socket.username, false);
        socket.broadcast.emit('leaved', {name: socket.username, total});
        socket.broadcast.emit('user disconnected', {name: socket.username});
    })
});

getUsers();

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port " + PORT));