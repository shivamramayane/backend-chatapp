import express from 'express'
import {  createmessage, fetchMessagesByRoomId} from '../controllers/Message.js';
 const router  = express.Router();


 router.post('/createmessage', createmessage)
 router.post('/allmessage',fetchMessagesByRoomId)

 
 export default router;