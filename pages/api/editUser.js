"use server"

import { Login } from "@/models/Login";
import bcrypt from "bcrypt";
import { mongooseConnect } from "@/lib/mongoose";


export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, password, oldPassword,oldemail } = req.body;

  if (!oldemail) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await mongooseConnect(); 

    const user = await Login.findOne({ email:oldemail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate old password if password update is requested

    if (password && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update fields if changed
    if (name) user.name = name;
    if (email !== user.email) user.email = email; 

    await user.save();

    return res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
