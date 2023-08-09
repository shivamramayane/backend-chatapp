import express from 'express'
import { createRoom,fetchallrooms } from '../controllers/CreateRoom.js';
 const router  = express.Router();


 router.post('/createroom', createRoom)
 router.get('/allrooms',fetchallrooms)

 
 export default router;