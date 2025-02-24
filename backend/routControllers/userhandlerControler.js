import User from "../Models/userModels.js";
import Conversation from "../Models/conversationModels.js";

/**
 * Get users by search query.
 * Excludes the current user from the results and hides sensitive fields.
 */
export const getUserBySearch = async (req, res) => {
  try {
     const search = req.query.search || '';
     const currentUserID = req.user.id;
     const users = await User.find({
       $and: [
         {
           $or: [
             { username: { $regex: `.*${search}.*`, $options: 'i' } },
             { fullname: { $regex: `.*${search}.*`, $options: 'i' } },
             { gender: { $regex: `.*${search}.*`, $options: 'i' } }
           ]
         },
         { _id: { $ne: currentUserID } }
       ]
     }).select("-password -email");

     res.status(200).json(users);
   } catch (error) {
     console.error("Error during user search:", error);
     res.status(500).json({
       success: false,
       message: error.message || 'Internal server error'
     });
   }
};

/**
 * Get current chatters of the user.
 * Retrieves all conversations involving the user and returns other participants.
 */
export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user._id; // Current user ID

    // Find conversations involving the current user, sorted by last update
    const currentChatters = await Conversation.find({
      participants: currentUserID
    }).sort({ updatedAt: -1 });

    // If no conversations found, return an empty array
    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).json([]);
    }

    // Collect IDs of all participants other than the current user
    const participantIDs = currentChatters.reduce((ids, conversation) => {
      const otherParticipants = conversation.participants.filter(
        id => id.toString() !== currentUserID.toString()
      );
      return [...ids, ...otherParticipants];
    }, []);

    // Remove duplicate participant IDs
    const uniqueParticipantIDs = [...new Set(participantIDs)];

    // Fetch details of the other participants, excluding sensitive fields
    const users = await User.find({ _id: { $in: uniqueParticipantIDs } }).select("-password -email");

    res.status(200).json(users); // Send user details
  } catch (error) {
    console.error("Error fetching current chatters:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
