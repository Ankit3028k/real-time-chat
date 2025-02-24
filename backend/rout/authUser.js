import express from "express";
import { userLogin, userLogout, userRegister } from "../routControllers/userroutControler.js";
const router = express.Router();
// Registration route
router.post('/register',userRegister)
// Login route 
router.post('/login',userLogin)
// logout route 
router.post('/logout',userLogout)

export default router; 