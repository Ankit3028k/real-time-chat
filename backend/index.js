import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./DB/dbConnect.js";
import authRouter from './rout/authUser.js';
import messageRouter from './rout/messageRout.js';
import cookieParser from "cookie-parser";
import userRouter from "./rout/userRoute.js";
import cors from 'cors';

const app = express();

dotenv.config();
 
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true,  // Allow cookies to be sent
  }));

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('Hello Ankit!');  
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    dbConnect();
    console.log(`Server running at http://localhost:${PORT}`);
});
