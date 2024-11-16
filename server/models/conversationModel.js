import mongoose from "mongoose";

const conversationModel = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        message: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        seen: { type: Boolean, default: false },
    }]
});
export const Conversation = mongoose.model("Conversation", conversationModel);