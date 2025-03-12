import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { Login } from "@/models/Login";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const connectDb = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDb();

        const { email, password } = credentials;
        
        try {
          // Find user by email
          const user = await Login.findOne({ email });
          
          if (!user) {
            throw new Error("ไม่พบผู้ใช้ด้วยอีเมลนี้");
          }
          
          // Check if password exists and is correct
          if (!user.password) {
            throw new Error("บัญชีนี้ไม่ได้ใช้รหัสผ่านในการเข้าสู่ระบบ");
          }
          
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          
          if (!isPasswordMatch) {
            throw new Error("รหัสผ่านไม่ถูกต้อง");
          }
          
          // Return user object if authentication is successful
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.profileImage || null,
          };
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDb();
      
      // For Google sign-in, check if user exists and create if not
      if (account.provider === "google") {
        const existingUser = await Login.findOne({ email: user.email });
        
        if (!existingUser) {
          const newUser = new Login({
            name: user.name,
            email: user.email,
            profileImage: user.image,
            // No password for Google users
          });
          await newUser.save();
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        token.accessToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // or 'strict'
        httpOnly: true,
        path: "/",
    },
},

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login', 
  },
});