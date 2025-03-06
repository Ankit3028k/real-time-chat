import express from "express";
import dotenv from 'dotenv';
import dbConnect from "./DB/dbConnect.js";
import authRouter from './rout/authUser.js';
import messageRouter from './rout/messageRout.js';
import cookieParser from "cookie-parser";
import userRouter from "./rout/userRoute.js";
import cors from 'cors';
import { app, server } from './Socket/socket.js';

dotenv.config();

app.use(express.json());
app.use(cookieParser());

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('Hello Ankit!');  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    dbConnect();
    console.log(`🚀 Server running on port ${PORT}`);
});
