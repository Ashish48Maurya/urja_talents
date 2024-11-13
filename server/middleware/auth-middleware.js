import jwt from 'jsonwebtoken';
import User from "../models/userModel.js"

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    const jwtToken = token.replace(/^Bearer\s/, "").trim();

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        const userData = await User.findOne({ _id: isVerified._id }).select({ password: 0 });

        if (!userData) {
            console.log("User not found");
            return res.status(401).json({ message: "User not found" });
        }
        req.user = userData;
        req.token = token;
        req.userID = userData._id;
        next();
    } catch (err) {
        const error = {
            statusCode: 500,
            message: err.message
        }
        return next(error)
    }
};

export default authMiddleware;