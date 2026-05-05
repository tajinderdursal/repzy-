import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/comment";
export async function GET(req, context) {
  await connectDB();

  const params = await context.params; 

  const comments = await Comment
    .find({ photoId: params.photoId })
    .populate("userId")
    .sort({ createdAt: -1 });

  return Response.json(comments);
}