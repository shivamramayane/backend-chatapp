import express from 'express'
import { getUserInfo, getallusers, updateUser } from '../controllers/user.js';

const router = express.Router();
router.get('/me/info',getUserInfo);
router.put('/me',updateUser)
router.get('/getallusers',getallusers)

export default router;