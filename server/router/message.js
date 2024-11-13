import express from "express"
import authMiddleware from "../middleware/auth-middleware.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";
const router = express.Router();

router.post('/message',authMiddleware,sendMessage)
router.get('/message',authMiddleware,getMessages)

export default router;