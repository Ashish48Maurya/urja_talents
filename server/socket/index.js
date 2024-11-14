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
    console.log(userId);
    if (userId !== undefined) {
        userSocketMap[userId] = socket.id;
    }
    console.log("User Connnected: ", socket.id);

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id);
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
})

// import {Server} from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors:{
//         origin:['http://localhost:3000'],
//         methods:['GET', 'POST'],
//     },
// });

// export const getReceiverSocketId = (receiverId) => {
//     return userSocketMap[receiverId];
// }

// const userSocketMap = {}; // {userId->socketId}


// io.on('connection', (socket)=>{
//     const userId = socket.handshake.query.userId
//     if(userId !== undefined){
//         userSocketMap[userId] = socket.id;
//     }

//     io.emit('getOnlineUsers',Object.keys(userSocketMap));

//     socket.on('disconnect', ()=>{
//         delete userSocketMap[userId];
//         io.emit('getOnlineUsers',Object.keys(userSocketMap));
//     })

// })

// export {app, io, server};


