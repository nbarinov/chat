import express from 'express';
import http from 'http';
import path from 'path';
import SocketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const files = express['static'](path.join(__dirname, '../../dist'));

app.use(files);

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', message => {
        io.emit('chat message', message);
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});