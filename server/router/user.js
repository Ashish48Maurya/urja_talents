import express from "express"
import { getOtherUsers, login, logout, register, updateUser, user } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth-middleware.js";
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/users',authMiddleware,getOtherUsers)
router.get('/user',authMiddleware,user)
router.patch('/user',authMiddleware,updateUser)

export default router;