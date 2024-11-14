import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
    const { fullName, password, email, profilePhoto } = req.body;
    if (!email || !fullName || !password) {
        const error = {
            statusCode: 404,
            message: "Please add all the fields"
        }
        return next(error)
    }

    try {
        const existingUser = await User.findOne({ email });
        const error = {
            statusCode: 404,
            message: "User already exists! with this email"
        }
        if (existingUser) {
            return next(error)
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePhoto
        });
        await user.save();
        return res.status(200).json({ message: "Registration Successfull", success: true });
    } catch (err) {
        const error = {
            statusCode: 500,
            message: err.message
        }
        next(error)
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = {
            statusCode: 404,
            message: "Please provide a valid email and password"
        }
        return next(error)
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = {
                statusCode: 404,
                message: "Invalid email or password"
            }
            return next(error)
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const secretKey = process.env.JWT_SECRET_KEY;
            const token = jwt.sign({ _id: user.id }, secretKey, {
                expiresIn: '7d'
            });
            // res.setHeader('Set-Cookie', serialize('authToken', token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     maxAge: 60 * 60 * 24 * 7,
            //     path: '/',
            // }));

            // return res.status(200).json({
            //     success: true,
            //     message: "Login successful",
            // });

            return res.status(200).cookie("token", token, {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: 'strict',
                path: '/'
            }).json({
                success: true,
                message: "Login successful"
            });

        } else {
            const error = {
                statusCode: 404,
                message: "Invalid Credentials!!!"
            }
            return next(error)
        }
    } catch (err) {
        const error = {
            statusCode: 500,
            message: err.message
        }
        return next(error)
    }
}

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.userID;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json({ otherUsers, success: true });
    } catch (err) {
        const error = {
            statusCode: 500,
            message: err.message
        }
        next(error)
    }
}

export const logout = async (req, res) => {
    return res.status(200).cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        path: '/'
    }).json({
        success: true,
        message: "Logout successful"
    });
}

export const user = async(req,res)=>{
    try {
        const loggedInUserId = req.userID;
        const user = await User.find({ _id: loggedInUserId }).select("-password");
        return res.status(200).json({ user, success: true });
    } catch (err) {
        const error = {
            statusCode: 500,
            message: err.message
        }
        next(error)
    }
}