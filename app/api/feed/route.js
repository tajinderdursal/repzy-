import { connectDB } from "@/lib/mongodb";
import ProgressPhoto from "@/models/progressphoto";

export async function GET(){

 await connectDB();

 const posts = await ProgressPhoto
  .find({ isPublic:true })
  .populate("userId")
  .sort({ createdAt:-1 });

 return Response.json(posts);
}