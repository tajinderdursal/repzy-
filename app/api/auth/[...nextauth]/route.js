import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import User from "@/models/signupdata";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await connectDB();

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          password: "google_user", // dummy
          profilePhoto: user.image || "",
        });
      }

      // 🔥 CREATE JWT TOKEN (THIS WAS MISSING)
      const token = jwt.sign(
        { userId: existingUser._id },
        "mysecretkey",
        { expiresIn: "1d" }
      );

      // 🔥 STORE TOKEN IN COOKIE
      const cookieStore = await cookies();

cookieStore.set("token", token, {
  httpOnly: true,
  secure: false,
  path: "/",
});
      return true;
    },
  },
};

// handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };