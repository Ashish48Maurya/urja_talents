import 'dotenv/config'
import express from "express"
import mongoConnect from './db.js';
import errorHandler from './middleware/error-middleware.js';
import userRouter from './router/user.js';
import messageRouter from './router/message.js';
import cors from "cors"
import cookieParser from 'cookie-parser';
import {app,server} from "./socket/index.js"


const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api",userRouter)
app.use("/api",messageRouter)
app.use(errorHandler)

server.listen(process.env.PORT, async ()=>{
    await mongoConnect(process.env.MONGOURI)
    console.log(`Backend is Live 🎉🎉`)
})