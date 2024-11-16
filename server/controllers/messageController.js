import { Conversation } from "../models/conversationModel.js";
import { decrypt, encrypt } from "../utils/feature.js";

export const sendMessage = async (req, res, next) => {
    try {
        const senderId = req.userID;
        const receiverId = req.query?.id;
        const { message } = req.body;

        if(message.trim().length === 0){
            return next({
                statusCode: 400,
                message: "Message cannot be empty",
            });
        }

        if (!senderId || !receiverId) {
            const error = {
                statusCode: 404,
                message: "Sender or Receiver Id Required"
            }
            return next(error)
        }

        if (!message) {
            const error = {
                statusCode: 404,
                message: "message required"
            }
            return next(error)
        }

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = new Conversation({
                participants: [senderId, receiverId]
            })
            await gotConversation.save();
        };
        gotConversation.messages.push({ message: encrypt(message), createdAt: new Date(), user: senderId });
        await gotConversation.save();
        res.status(200).json({ message: "Msg sent Successfully", success: true })
        // };
    } catch (err) {
        const error = {
            statusCode: 500,
            message: err.message
        }
        next(error)
    }
}

export const getMessages = async (req, res, next) => {
    const senderId = req.userID;
    const receiverId = req.query?.id;
    try {
        if (!senderId || !receiverId) {
            const error = {
                statusCode: 404,
                message: "Sender or Receiver Id Required"
            }
            return next(error)
        }
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            const error = {
                statusCode: 404,
                message: "Conversation not found"
            }
            return next(error)
        }
        // let messages = gotConversation.messages.sort((a, b) => a.createdAt - b.createdAt);
        let messages = gotConversation.messages
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((msg) => ({
                ...msg.toObject(),
                message: decrypt(msg.message),
            }));
        res.status(200).json({ messages, success: true });
    }
    catch (err) {
        const error = {
            statusCode: 500,
            message: err.message
        }
        next(error)
    }
}