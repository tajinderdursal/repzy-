import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import signupdata from "@/models/signupdata";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// 🔥 COMMON FUNCTION (reusable auth)
async function getUserId(req) {
  let userId = null;

  // JWT
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, "mysecretkey");
      userId = decoded.userId;
    } catch {
      console.log("JWT invalid");
    }
  }

  // Google
  if (!userId) {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await signupdata.findOne({
        email: session.user.email,
      });
      if (user) userId = user._id;
    }
  }

  return userId;
}

// ================== POST (UPLOAD) ==================
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ message: "No file uploaded" }, { status: 400 });
    }

    const userId = await getUserId(req);

    if (!userId) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "repzy_profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 🔥 SAVE public_id ALSO
    const updatedUser = await signupdata.findByIdAndUpdate(
      userId,
      {
        profilePhoto: upload.secure_url,
        profilePhotoId: upload.public_id, // ✅ IMPORTANT
      },
      { new: true }
    );

    return Response.json(updatedUser);

  } catch (error) {
    console.error(error);
    return Response.json({ message: "Upload failed" }, { status: 500 });
  }
}

// ================== DELETE (REMOVE) ==================
export async function DELETE(req) {
  try {
    await connectDB();

    const userId = await getUserId(req);

    if (!userId) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await signupdata.findById(userId);

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // 🔥 DELETE FROM CLOUDINARY
    if (user.profilePhotoId) {
      try {
        await cloudinary.uploader.destroy(user.profilePhotoId);
      } catch (err) {
        console.log("Cloudinary delete failed:", err.message);
      }
    }

    // 🔥 REMOVE FROM DB
    user.profilePhoto = "";
    user.profilePhotoId = "";

    await user.save();

    return Response.json({ message: "Photo removed successfully" });

  } catch (error) {
    console.error(error);
    return Response.json({ message: "Delete failed" }, { status: 500 });
  }
}