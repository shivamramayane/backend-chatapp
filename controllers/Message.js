import Message from "../models/Message.js";
import CreateRoom from "../models/CreateRoom.js";
import io from "../index.js";

export const createmessage = async (req, res) => {
  try {
    const { type, text, photos, roomId, date, seen } = req.body;

    // Extract authorId from the decoded token
    const { userId } = req;

    // Check the room status before creating the message
    const room = await CreateRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (room.status === "blocked") {
      return res
        .status(403)
        .json({ error: "Cannot create message in a blocked room." });
    }

    // Create a new message based on the provided type
    const newMessage = new Message({
      type,
      date,
      seen,
      text: type === "text" ? text : undefined,
      photos: type === "image" ? photos : undefined,
      roomId,
      authorId: userId, // Set the authorId from the decoded token
    });

    const createdMessage = await newMessage.save();
    // io.emit("CreatedMessage", createdMessage);
    io.emit("newMessageCreated", createdMessage);
    res.status(201).json(createdMessage);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the message." });
  }
};
// export const createmessage = () => async (req, res) => {
//   try {
//     const { type, text, photos, roomId, date, seen } = req.body;
//     const { userId } = req;

//     // Check the room status before creating the message
//     const room = await CreateRoom.findById(roomId);
//     if (!room) {
//       return res.status(404).json({ error: 'Room not found' });
//     }
//     if (room.status === 'blocked') {
//       return res.status(403).json({ error: 'Cannot create message in a blocked room.' });
//     }

//     // Emit the message to the room using Socket.IO

//     // Create a new message based on the provided type
//     const newMessage = new Message({
//       type,
//       date,
//       seen,
//       text: type === 'text' ? text : undefined,
//       photos: type === 'image' ? photos : undefined,
//       roomId,
//       authorId: userId,
//     });

//     const createdMessage = await newMessage.save();
//     console.log("hii",createdMessage)
//     res.status(201).json(createdMessage);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'An error occurred while creating the message.' });
//   }
// };

// export const fetchMessagesByRoomId = async (req, res) => {
//   try {
//     const { roomId, page } = req.body; // Use query parameter for pagination

//     const perPage = 20;
//     const skip = (page - 1) * perPage;

//     // Fetch 20 messages for the specified room ID based on pagination
//     const messages = await Message.find({ roomId })
//       .skip(skip)
//       .limit(perPage)
//       .lean();
//     io.emit("allmassage", messages);
//     res.status(200).json(messages);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching messages." });
//   }
// };
export const fetchMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.body;

    // Fetch all messages for the specified room ID
    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 }) // Sort by createdAt field in ascending order
      .lean();

    io.emit("allmassage", messages);
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages." });
  }
};

// export const fetchMessagesByRoomId = async (req, res) => {
//   try {
//     const { roomId, page } = req.body; // Use query parameter for pagination

//     const perPage = 100;
//     const skip = (page - 1) * perPage;

//     // Fetch messages for the specified room ID based on pagination
//     const messages = await Message.find({ roomId })
//       .skip(skip)
//       .limit(perPage)
//       .lean();

//     const extractedRoomId = extractRoomId(messages[0]); // Extract room ID from the first message (assuming there's at least one message)
    
//     io.emit("allmassage", messages);

//     const response = {
//       roomId: extractedRoomId,
//       messages: messages
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "An error occurred while fetching messages." });
//   }
// };

// function extractRoomId(message) {
//   if (message && message.roomId) {
//     return message.roomId;
//   } else {
//     return null; // Handle the case when roomId is missing
//   }
// }

