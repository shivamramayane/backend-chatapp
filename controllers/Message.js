import Message from "../models/Message.js";
export const createmessage =async(req,res)=>{
    try {
        const { type, text, photos, roomId, date,seen} = req.body;
    
        // Extract authorId from the decoded token
        const { userId } = req;
    
        // Create a new message based on the provided type
        const newMessage = new Message({
          type,
          date,seen,
          text: type === 'text' ? text : undefined,
          photos: type === 'image' ? photos : undefined,
          roomId,
          authorId: userId, // Set the authorId from the decoded token
        });
    
        const createdMessage = await newMessage.save();
        res.status(201).json(createdMessage);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the message.' });
      }
}

// Import your necessary models and modules
// import Message from '../models/Message.js';

export const fetchMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.body;

    // Fetch all messages for the specified room ID
    const messages = await Message.find({ roomId }).lean();

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
};
