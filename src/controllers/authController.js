import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import validator from "validator";
import axios from "axios";
import { google } from "googleapis";

// SignUp for new user - No Log in required
export const googleAuth = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ message: "Authorization code missing" });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'postmessage'
    );

    try {
        // FIX 1: Use process.env variables directly here
        const { tokens } = await oauth2Client.getToken({
            code: code,
            client_id: process.env.GOOGLE_CLIENT_ID, 
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'postmessage'
        });
        
        oauth2Client.setCredentials(tokens);

        // FIX 2: Use the 'tokens' variable you destructured above, not 'googleRes'
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${tokens.access_token}`
        );

        const { email, name, picture } = userRes.data;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture || null,
                provider: "google",
                isProfileComplete: false
            });
        }

        if (user.provider !== "google") {
            return res.status(400).json({
                message: "Please login using email & password"
            });
        }

        if (user.isDeleted) {
            return res.status(403).json({
                message: "Account is deactivated"
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT || '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Google authentication successful",
            user
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error during Google Auth" });
    }
};

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Fields are missing" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Weak password" });
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashed,
            provider: "email",
            isProfileComplete: false
        });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {
        // duplicate key fix
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ message: error.message });
    }
};

export const completeProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { role, address, contactInfo, latitude, longitude } = req.body;

        if (!role || !address || !contactInfo || !latitude || !longitude) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!["restaurant", "ngo"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isProfileComplete) {
            return res.status(400).json({ message: "Profile already completed" });
        }

        user.role = role;
        user.address = address;
        user.contactInfo = contactInfo;

        user.location = {
            type: "Point",
            coordinates: [longitude, latitude],
        };

        user.isProfileComplete = true;

        // trial logic
        if (role === "restaurant") {
            if (!user.hasUsedTrial) {
                user.trialStartDate = new Date();
                user.trialEndDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                user.status = "trial";
                user.hasUsedTrial = true;
            } else {
                // user.status = "none";
                user.status = "expired";
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile completed successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.provider !== "email") {
            return res.status(400).json({
                message: "Please login using Google"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.isDeleted) {
            return res.status(403).json({
                message: "Account is deactivated"
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.status(200).json({ message: "Logged out successfully" });
};



