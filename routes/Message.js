import express from 'express'
import {  createmessage, fetchMessagesByRoomId} from '../controllers/Message.js';
 const router  = express.Router();


 router.post('/createmessage', createmessage)
 router.get('/allmessage',fetchMessagesByRoomId)

 
 export default router;