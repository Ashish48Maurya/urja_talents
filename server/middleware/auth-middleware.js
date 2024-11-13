import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userData = await User.findById(decoded._id).select("-password");
        if (!userData) return res.status(401).json({ message: "User not found" });
        req.user = userData;
        req.userID = userData._id;
        next();
    } catch (err) {
        return next({ statusCode: 500, message: err.message });
    }
};

export default authMiddleware;