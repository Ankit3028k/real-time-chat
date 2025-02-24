import mongoose from "mongoose";
import Message from "../Models/messageSchema.js";
// import User from "../Models/userSchema.js";
const conversationSchema=mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
        default:[]
    }]
},{Timestamp:true});

const Conversation=mongoose.model('Conversation',conversationSchema)

export default Conversation;