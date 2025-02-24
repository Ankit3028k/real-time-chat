import Conversation from "../Models/conversationModels.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findone({
            participants: { $all: [senderId, receiverId] }
        })
        if (!chats) {
            chats = await Conversation.create({ participants: [senderId, receiverId] })
        }
        const newMessage = new message({
            senderId,
            receiverId,
            message,
            conversationId: chats._id
        })
        if (newMessage) {
            chats.message.push(newMessage._id)
        }
        //socket.io function
        await Promise.all([chats.save(),newMessage.save()]); 
        res.status(201).send(newMessage)
    } catch (error) {
        res.status(500).send(error)
    }
}
