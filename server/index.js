import 'dotenv/config'
import express from "express"
import mongoConnect from './db.js';
import errorHandler from './middleware/error-middleware.js';
import userRouter from './router/user.js';
import messageRouter from './router/message.js';
const app = express();

app.use(express.json());
app.use("/api",userRouter)
app.use("/api",messageRouter)
app.use(errorHandler)

app.listen(process.env.PORT, async ()=>{
    await mongoConnect(process.env.MONGOURI)
    console.log(`Backend is Live 🎉🎉`)
})