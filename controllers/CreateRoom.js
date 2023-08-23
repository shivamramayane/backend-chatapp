import CreateRoom from "../models/CreateRoom.js";
import User from "../models/User.js";
import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import io from "../index.js";

export const createRoom = async (req, res) => {
  try {
    const { userId } = req;
    const userid = userId;
    const otherUserId = req.body.members;
    const status = req.body.status;
    const existingRoom = await CreateRoom.findOne({
      members: { $all: [userId, otherUserId] },
    });

    if (existingRoom) {
      return res.status(200).json(existingRoom);
    }
    if (otherUserId === userId) {
      return res
        .status(400)
        .json({ error: "Cannot create room with yourself" });
    }
    const newRoom = new CreateRoom({
      userid,
      members: [userId, otherUserId],
      status,
    });
    // const socket = io('http://localhost:3001');
    // socket.emit('joinRoom', savedRoom);

    const savedRoom = await newRoom.save();
    // io.emit("newRoomCreated", savedRoom);
    io.emit("newroom", savedRoom);
    return res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
export const updateLatestMessage = async (req, res) => {
  try {
    const { roomId, latestmessage, date } = req.body;

    // Find the room by its ID and update the latest message
    const updatedRoom = await CreateRoom.findByIdAndUpdate(
      roomId,
      { latestmessage, date },
      { new: true } // Return the updated room after the update
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    io.emit("updateroom", updatedRoom);
    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
// import CreateRoom from '../models/CreateRoom.js'; // Replace with your model path
// import {Server} from 'socket.io'
// import express from 'express'
// import http from 'http'
// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST","DELETE","PUT"],
//   },
// });
// Pass io to the controller function
// ... (other imports and setup code)

// export const createRoom = (io) => async (req, res) => {
//   try {
//     console.log('Create room API called'); // Add this line for debugging
//     const { userId } = req;
//     const otherUserId = req.body.members;
//     const status = req.body.status;

//     // Check if the room already exists
//     console.log('Checking for existing room'); // Add this line for debugging
//     const existingRoom = await CreateRoom.findOne({
//       members: { $all: [userId, otherUserId] },
//     });

//     if (existingRoom) {
//       console.log('Existing room found'); // Add this line for debugging
//       // Join the existing room using Socket.IO
//       io.to(existingRoom._id).emit("joinRoom", existingRoom._id);

//       return res.status(200).json(existingRoom);
//     }

//     console.log('Creating new room'); // Add this line for debugging
//     // Create a new room
//     const newRoom = new CreateRoom({
//       userid: userId,
//       members: [userId, otherUserId],
//       status,
//     });

//     const savedRoom = await newRoom.save();

//     console.log('New room created'); // Add this line for debugging
//     // Join the newly created room using Socket.IO
//     // io.to(savedRoom._id).emit("joinRoom", savedRoom._id);

//     return res.status(201).json(savedRoom);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// export const fetchallrooms = async (req, res) => {
//   try {
//     const {userId} = req; // Assuming you've extracted the login user's ID using middleware

//     const roomsCreatedByUser = await CreateRoom.find({ userid: userId }).lean();

//     const roomIdsCreatedByUser = roomsCreatedByUser.map(room => room._id);

//     const users = await CreateRoom.aggregate([
//       {
//         $match: {
//           _id: { $in: roomIdsCreatedByUser },
//         },
//       },
//       {
//         $lookup: {
//           from: "rooms",
//           localField: "_id",
//           foreignField: "userid",
//           as: "result",
//         },
//       },
//     ]);

//     res.status(200).json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

export const fetchallrooms = async (req, res) => {
  try {
    const { userId } = req; // Assuming you've extracted the login user's ID using middleware
console.log('fetchallrooms : userId',userId)
    const roomsCreatedByUser = await CreateRoom.find({
      members: userId,
    }).lean();

    const roomIdsCreatedByUser = roomsCreatedByUser.map((room) => room._id);

    const rooms = await CreateRoom.aggregate([
      {
        $match: {
          _id: { $in: roomIdsCreatedByUser },
        },
      },
      {
        $lookup: {
          from: "userdatas", // Change "userdatas" to the actual collection name for user details
          localField: "members",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      {
        $addFields: {
          memberDetails: {
            $filter: {
              input: "$memberDetails",
              as: "member",
              cond: {
                $and: [
                  // { $ne: ["$$member._id", userId] },
                  {
                    $ne: ["$$member._id", new mongoose.Types.ObjectId(userId)],
                  },
                  // { $ne: ["$$member._id", "$userid"] },
                ],
              },
            },
          },
          secondMemberId: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$members",
                  as: "memberId",
                  cond: { $ne: ["$$memberId", userId] },
                },
              },
              1, // Index of the second member
            ],
          },
        },
      },
      {
        $addFields: {
          memberDetails: {
            $concatArrays: [
              "$memberDetails",
              // [{ _id: userId, }],
            ],
          },
        },
      },
      {
        $addFields: {
          roomDetails: "$$ROOT",
        },
      },
      {
        $project: {
          memberDetails: 1,
          _id: "$roomDetails._id",
          userid: "$roomDetails.userid",
          status: "$roomDetails.status",
          latestmessage: "$roomDetails.latestmessage",
          date: "$roomDetails.date",
        },
      },
    ]);
    io.emit("fetchedRooms", rooms);

    console.log("Rooms:", rooms); // Debugging line

    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { roomId } = req.body;
    const { status } = req.body;

    const updatedRoom = await CreateRoom.findByIdAndUpdate(
      roomId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
