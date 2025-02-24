import express from "express";
import { createConversation, getUserConversations, addMessageToConversation } from "../routControllers/conversationController.js";

const router = express.Router();

// Route to create a new conversation
router.post("/create", createConversation);

// Route to get all conversations for a user
router.get("/:userId", getUserConversations);

// Route to add a message to a conversation
router.post("/message", addMessageToConversation);

export default router;
