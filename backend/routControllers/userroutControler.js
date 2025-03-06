import bcrypt from "bcryptjs";
import jwtToken from '../utils/jwtwebToken.js';
import User from "../Models/userModels.js";  // ✅ Fixed Import Issue

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, password, gender, profilepic } = req.body;

        // Check if user already exists
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) return res.status(400).send({ success: false, message: "Username or Email already registered" });

        // Hash the password
        const hashPassword = bcrypt.hashSync(password, 10);

        // Default Profile Picture Logic
        const defaultProfile = `https://avatar.iran.liara.run/public/neutral?username=${username}`;
        const profileBoy = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const finalProfilePic = profilepic || (gender === "male" ? profileBoy : gender === "female" ? profileGirl : defaultProfile);

        // Create new user
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: finalProfilePic
        });

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res);
        } else {
            return res.status(400).send({ success: false, message: "Failed to create user" });
        }

        res.status(200).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            profilepic: newUser.profilepic,
            success: true
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send({ success: false, message: "Error in registration" });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).send({ success: false, message: "Invalid email " });

        const comparePass = bcrypt.compareSync(password, user.password || "");
        if (!comparePass) return res.status(400).send({ success: false, message: "Invalid email or password" });

        jwtToken(user._id, res);
        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,  
            message: "Login successful",
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send({ success: false, message: "Error in login" });
    }
};

export const userLogout = async (req, res) => {
    try {
        res.clearCookie('jwt'); 
        res.status(200).send({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).send({ success: false, message: "Error in logout" });
    }
};
