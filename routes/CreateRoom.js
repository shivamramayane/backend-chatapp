import express from 'express'
import { createRoom,fetchallrooms, updateLatestMessage, updateRoomStatus } from '../controllers/CreateRoom.js';
 const router  = express.Router();


 router.post('/createroom', createRoom)
 router.get('/allrooms',fetchallrooms)
 router.put('/blockchat',updateRoomStatus)
 router.put('/updateroom',updateLatestMessage)

 
 export default router;