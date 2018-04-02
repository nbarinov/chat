import express from 'express';
import http from 'http';
import path from 'path';
import SocketIO from 'socket.io';
import { findUser, findUserByName, addUser, removeUser } from '../libs/utils';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const files = express['static'](path.join(__dirname, '../../dist'));

let users = [];
let sockets = {};
let usersTyping = [];

app.use(files);

io.on('connection', socket => {
    const username = socket.handshake.query.username;
    let currentUser = {
        id: socket.id,
        username
    };

    if(findUser(users, currentUser.id) === 0) {
        console.log(`User ${currentUser.username} connected`);

        sockets[currentUser.id] = socket;
        users = addUser(users, currentUser);
        io.emit('user join', currentUser.username);

        console.log('Total users: ' + users.length);

        console.log('Users: ');
        for(var i = 0; i < users.length; i++) {
            console.log(users[i].username);
        }
        console.log('\n');
    } else {
        console.log('User ID is already connected, kicking.');
        socket.disconnect();
    }

    socket.on('disconnect', () => {
        users = removeUser(users, currentUser.id);
        console.log(`User ${currentUser.username} disconnected`);
        socket.broadcast.emit('user disconnect', currentUser.username);
    });

    socket.on('message', data => {
        console.log('[SERVER] new message');
        io.emit('message', data);
    });

    socket.on('user started typing', username => {
        if(!findUserByName(usersTyping, username)) {
            usersTyping = addUser(usersTyping, findUserByName(users, username));
            console.log(usersTyping);
            console.log(username, 'start typing');
            console.log('\n');
            io.emit('user is typing', usersTyping);
        }
    });

    socket.on('user ended typing', username => {
        if(findUserByName(usersTyping, username)) {
            usersTyping = removeUser(usersTyping, findUserByName(users, username).id);
            console.log(usersTyping);
            console.log(username, 'end typing');
            console.log('\n');
            io.emit('user is typing', usersTyping);
        }
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});