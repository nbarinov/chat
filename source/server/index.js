import express from 'express';
import http from 'http';
import path from 'path';
import SocketIO from 'socket.io';
import { findUser, addUser, removeUser } from '../libs/utils';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const files = express['static'](path.join(__dirname, '../../dist'));

let users = [];
let sockets = {};

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
        // io.emit('disconnect');
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
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});