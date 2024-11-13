import express from "express"
import { getOtherUsers, login, register } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth-middleware.js";
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/users',authMiddleware,getOtherUsers)

export default router;