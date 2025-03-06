import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js"; // Correct import
import { getReciverSocketId,io } from "../Socket/socket.js";
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const currentDate = new Date();
        const read = false; 

 
        // Corrected the method name from findone to findOne
        let chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!chats) {
            chats = await Conversation.create({ participants: [senderId, receiverId] });
        }
        // Format the date and time
        const date = currentDate.toISOString().split('T')[0];  // YYYY-MM-DD
        const time = currentDate.toString().split(' ')[4];  // HH:MM:SS
        // Use the Message model to create a new  message  
        const newMessages = new Message({
            senderId,
            receiverId,
            message,
            date,
            time,
            read,
            
            conversationId: chats._id
        });

        if (newMessages) {
            chats.messages.push(newMessages._id);
        }
        await Promise.all([chats.save(), newMessages.save()]); 
       
  //SOCKET.IO function 
  const reciverSocketId = getReciverSocketId(reciverId);
  if(reciverSocketId){
     io.to(reciverSocketId).emit("newMessage",newMessages)
  }

 res.status(201).send(newMessages)
        
       
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: err.message });
    }
};


 export const getMessage=async(req,res)=>{
try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const date = new Date();
    const read = false;
    

    const chats = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    }).populate("messages")

    if(!chats)  return res.status(200).send([]);
    const message = chats.messages;
    res.status(200).send(message ,read,date);
} catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: err.message });
}
};