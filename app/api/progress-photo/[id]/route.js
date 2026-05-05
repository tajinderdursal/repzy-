import { connectDB } from "@/lib/mongodb";
import progressPhoto from "@/models/progressphoto";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/signupdata";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req, context) {
  try {
    await connectDB();

const { id } = await context.params;

    let userId = null;

    // 🔹 1. Try JWT
    const token = req.cookies.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, "mysecretkey");
        userId = decoded.userId;
      } catch (err) {
        console.log("JWT invalid");
      }
    }

    // 🔹 2. Try Google session
    if (!userId) {
      const session = await getServerSession(authOptions);

      if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          userId = user._id;
        }
      }
    }

    // ❌ Not authenticated
    if (!userId) {
      return Response.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 🔹 Find photo owned by user
    const photo = await progressPhoto.findOne({
      _id: id,
      userId: userId,
    });

    if (!photo) {
      return Response.json(
        { message: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    // 🔹 Delete photo
   // 🔹 Delete from Cloudinary FIRST
if (photo.publicId) {
  try {
    await cloudinary.uploader.destroy(photo.publicId);
  } catch (err) {
    console.log("Cloudinary delete failed:", err.message);
  }
}

// 🔹 Delete from DB
await progressPhoto.findByIdAndDelete(id);
    return Response.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}