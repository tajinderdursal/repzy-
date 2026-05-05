    import {connectDB} from "@/lib/mongodb";
import Follow from "@/models/follow";

export async function POST(req){

 await connectDB();

 const { followerId, followingId } = await req.json();

 const follow = await Follow.create({
  followerId,
  followingId
 });

 return Response.json(follow);

}