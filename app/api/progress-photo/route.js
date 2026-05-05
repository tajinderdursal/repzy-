import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import progressPhoto from "@/models/progressphoto";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/signupdata";

// 🔹 Helper to get userId (JWT + Google)
async function getUserId(req) {
  let userId = null;

  // 1. JWT
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, "mysecretkey");
      userId = decoded.userId;
    } catch (err) {
      console.log("JWT invalid");
    }
  }

  // 2. Google session
  if (!userId) {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email });
      if (user) userId = user._id;
    }
  }

  return userId;
}

// ================= POST =================
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file");
    const caption = formData.get("caption");
    const isPublic = formData.get("isPublic");

    if (!file) {
      return Response.json({ message: "No file uploaded" }, { status: 400 });
    }

    const userId = await getUserId(req);

    if (!userId) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    // 🔹 Convert file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🔹 Upload to Cloudinary
    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "repzy_progress" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 🔹 Save photo
   const photo = await progressPhoto.create({
  userId,
  image: upload.secure_url,
  publicId: upload.public_id,   // ✅ ADD THIS
  caption: caption || "",
  isPublic: isPublic === "true",
});

    return Response.json(photo);

  } catch (error) {
    console.error(error);
    return Response.json({ message: "Upload failed" }, { status: 500 });
  }
}

// ================= GET =================
export async function GET(req) {
  try {
    await connectDB();

    const userId = await getUserId(req);

    if (!userId) {
      return Response.json({ message: "Not authenticated" }, { status: 401 });
    }

    const photos = await progressPhoto.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    return Response.json(photos);

  } catch (error) {
    console.error(error);
    return Response.json({ message: "Fetch failed" }, { status: 500 });
  }
}