import 'dotenv/config'
import express from "express"
import mongoConnect from './db.js';
import errorHandler from './middleware/error-middleware.js';
import router from './router/router.js';
const app = express();

app.use(express.json());
app.use("/api/user",router)
app.use(errorHandler)

app.listen(process.env.PORT, async ()=>{
    await mongoConnect(process.env.MONGOURI)
    console.log(`Backend is Live 🎉🎉`)
})