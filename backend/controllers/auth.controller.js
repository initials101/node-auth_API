import bcrypt from 'bcryptjs';
import crypto from "crypto";

import { User } from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';


export const signup = async (req, res) => {
    const {email, password, name} = req.body;
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({email});
        if (userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists"});
            
        }

        const hashedPassword =await bcryptjs.hash(password, 12);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 1000 // 24HRS
        })

        await user.save();

        generateTokenAndSetCookie(res,user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            }, 
        });
        
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
        
    }
};


export const login = async (req, res) => {
    res.send("login route");
}


export const logout = async (req, res) => {
    res.send("logout route");
}

export const forgotPassword = async (req, res) => {
    const { emsil } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordEspiresAt = resetTokenExpiresAt;
        
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
    } catch (error) {
        
    }
}