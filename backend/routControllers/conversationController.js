import Conversation from "../Models/conversationSchema.js";
import Message from "../Models/messageSchema.js";

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { participants } = req.body;

    // Check if participants are provided
    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "At least two participants are required" });
    }

    // Create a new conversation
    const newConversation = new Conversation({
      participants,
    });

    // Save the conversation to the database
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating conversation" });
  }
};

// Get all conversations of a user
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all conversations that involve the user
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name email") // Populating participant details
      .populate({
        path: "messages",
        model: "Message",
        populate: { path: "sender", model: "User" }, // Populating message sender details
      });

    if (!conversations) {
      return res.status(404).json({ message: "No conversations found for this user" });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving conversations" });
  }
};

// Add a message to a conversation
export const addMessageToConversation = async (req, res) => {
  try {
    const { conversationId, sender, content } = req.body;

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Create a new message
    const newMessage = new Message({
      sender,
      content,
    });

    // Save the message
    const savedMessage = await newMessage.save();

    // Add the message to the conversation 
    conversation.messages.push(savedMessage);
    await conversation.save(); 

    // Send the updated conversation with new message
    res.status(200).json(conversation);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Error adding message to conversation" });
  }
};
