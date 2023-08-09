
import CreateRoom from '../models/CreateRoom.js';
import User from '../models/User.js';
export const createRoom = async (req, res) => {
    try {
        const {userId}= req
        const userid=userId
     const otherUserId = req.body.members;
      const status = req.body.status
      const existingRoom = await CreateRoom.findOne({
        members: { $all: [userId, otherUserId] },
      });
  
      if (existingRoom) {
        return res.status(200).json(existingRoom); 
      }
      if (otherUserId === userId) {
        return res.status(400).json({ error: 'Cannot create room with yourself' });
      }
      const newRoom = new CreateRoom({
        userid,
        members: [userId, otherUserId],
        status,
      });
      const savedRoom = await newRoom.save();
      return res.status(201).json(savedRoom);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };


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
  
      const roomsCreatedByUser = await CreateRoom.find({ userid: userId }).lean();
  
      const roomIdsCreatedByUser = roomsCreatedByUser.map(room => room._id);
  
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
                    { $ne: ["$$member._id", userId] },
                    { $ne: ["$$member._id", "$userid"] },
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
                [{ _id: userId, }],
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
          },
        },
      ]);
  
      console.log("Rooms:", rooms); // Debugging line
  
      res.status(200).json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  