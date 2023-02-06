const path = require("path");
const express = require("express");
const http = require("http");


const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, 'public')));

const io = require("socket.io")(server, {
    cors: {
        origin: "http://chat-app",
    },
});

let total = 0;

io.sockets.on("connection", (socket) => {
    console.log("Успешное соединение");
    // socket.on('message', function(data) {
    //     // Внутри функции мы передаем событие 'add mess',
    //     // которое будет вызвано у всех пользователей и у них добавиться новое сообщение
    //     io.sockets.emit('add mess', {mess: data.mess, name: data.name});
    // });
    socket.emit("welcome", "welcome man");


    const handshake = socket.handshake.query;
    if (!handshake.username) {
        setTimeout(() => socket.disconnect(true),1);
    } else {
        total++;
        socket.username = handshake.username;
        socket.broadcast.emit('new user', {name: socket.username, total});
        console.log(socket.username);
    }


    socket.on('message', (data) => {
        console.log(data);
        socket.emit('message', {name: socket.username, msg: data});
        socket.broadcast.emit('message', {name: socket.username, msg: data});
    });



    socket.on('disconnect', ()=> {
        console.log('disconnect', socket.username);
        total--;
        socket.broadcast.emit('leaved', {name: socket.username, total});
    })
});


const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log("Server running on port "+PORT));