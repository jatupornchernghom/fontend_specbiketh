// pages/api/register.js
import mongoose from "mongoose";
import { Login } from "@/models/Login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const connectDb = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDb();
    
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await Login.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new Login({
      name,
      email,
      password: hashedPassword,
      profileImage: null,
      favorites: [], // Default value
    });
    
    await newUser.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    return res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}