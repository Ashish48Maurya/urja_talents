import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    profilePhoto: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userModel);
export default User;