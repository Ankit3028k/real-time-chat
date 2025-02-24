import mongoose from "mongoose";


const messageSchema = mongoose.Schema(
    {
        senderId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        receiverId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        message: [
            {
                type: String,
                required: true,
            },
        ],
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
        },
        createdAt: {
            type: Date,
             default: Date.now
        },
        date: [
            {
                type: Date,
            },
        ],
        time: [
            {
                type: String,
            },
            ],
        read: [ 
            {
                type: Boolean,
            },
        ],
    },
    { Timestamp: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
