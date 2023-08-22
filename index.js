
// import express from 'express';
// import 'dotenv/config';
// import mongoose from 'mongoose';
// import morgan from 'morgan';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import allRoutes from './routes/index.js';
// import { Server } from "socket.io";

// const io = new Server(3001, { /* options */ });


// const app = express();
// const PORT = process.env.PORT || 8000;


// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());



// // routes
// app.use('/api', allRoutes);

// const connectDB= async()=>{
//     try {
//         await mongoose.connect("mongodb+srv://shivam123:7582944@cluster0.ilxtxcz.mongodb.net/chatingapp");
//         console.log("MONGO CONNECTED");
//     } catch (error) {
//         console.log(error)
//         process.exit(1)
//     }
// }
// io.on("connection", (socket) => {
//     // ...
//     console.log("new user",socket.id)
//   });
//  app.listen(3001,()=>{
    
//     connectDB();
//     console.log(`server in runing  at port `)
//  })
import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import allRoutes from './routes/index.js';
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 3001;
const httpServer = createServer(app);
 const io = new Server(httpServer);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // const savedRoom ="ji"
  // io.emit("newroom",savedRoom)
  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});
// routes
app.use('/api', allRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://shivam123:7582944@cluster0.ilxtxcz.mongodb.net/chatingapp");
        console.log("MONGO CONNECTED");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

httpServer.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at port ${PORT}`);
});

export default io
