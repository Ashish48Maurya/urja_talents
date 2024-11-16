import express from "express"
import { Server } from "socket.io"
import http from "http"

export const app = express();
export const server = http.createServer(app)

const userSocketMap = {};
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URI,
        credentials: true
    }
})

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('sendMessage', (messageData) => {
        const { receiverId } = messageData;
        const recipientSocketId = userSocketMap[receiverId];

        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receiveMessage', messageData);
        }
    });

    socket.on('typing', ({ userId, receiverId }) => {
        const recipientSocketId = userSocketMap[receiverId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('userTyping', { userId });
        }
    });

    socket.on('stopTyping', ({ userId, receiverId }) => {
        const recipientSocketId = userSocketMap[receiverId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('userStoppedTyping', { userId });
        }
    });

    socket.on('disconnect', () => {
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });

    socket.on('markAsSeen', ({userId, receiverId}) => {
        const recipientSocketId = userSocketMap[receiverId];
        if(recipientSocketId){
            io.to(recipientSocketId).emit('messageSeen', { userId, receiverId });
        }
    });
})