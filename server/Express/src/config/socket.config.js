/* eslint-disable no-param-reassign */
const socketio = require('socket.io');
const SocketUserAuthMiddleware = require('../middleware/SocketUserAuth.middleware');
const { Artist } = require('../models/user');
const Room = require('../models/room');
const Message = require('../models/message');

module.exports = (server) => {
    const io = socketio(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.use(SocketUserAuthMiddleware);

    io.on('connection', (socket) => {
        socket.on('joinRoom', async ({ room }) => {
            socket.join(room);
            socket.to(room).emit('message', { message: 'You joined the room' });
            Room.findOne({ room }).then(async (err, r) => {
                if (err) console.log(err);
                if (r) {
                    r.users.push(socket.user._id);
                    await r.save();
                }
            });
        });
        socket.on('message', ({ message }) => {
            io.to(socket.user.room).emit('message', { message });
            Message.create({
                text: message,
                objectUrl: null,
                type: 'text',
                user: socket.user._id,
            });
        });
    });

    io.on('connection', (socket) => {
        socket.on('joinVerify', ({ room }) => {
            socket.join(room);
            socket.on('id', ({ id }) => {
                socket.broadcast.to(room).emit('id', id);
            });
        });
    });
    return io;
};
