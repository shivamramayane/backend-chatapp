import express from "express";
// const express = require('express')
import authRoutes from './auth.js '
import chatRoutes from './CreateRoom.js'
import usersRoutes from './User.js'
import checkAuth from "../utils/checkAuth.js";
import MessageAuth from './Message.js'
const router = express.Router()

router.use('/auth',authRoutes)
router.use('/chat',checkAuth,chatRoutes)
router.use('/message',checkAuth,MessageAuth)
router.use('/users',checkAuth,usersRoutes);
router.use('/getall',usersRoutes)
// module.exports= router;
export default router;