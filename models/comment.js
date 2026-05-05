import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

 userId:{
  type: mongoose.Schema.Types.ObjectId,
  ref:"signupdata",
  required:true
 },

 photoId:{
  type: mongoose.Schema.Types.ObjectId,
  ref:"progressPhoto",
  required:true
 },

 text:{
  type:String,
  required:true
 },

 createdAt:{
  type:Date,
  default:Date.now
 }

});

export default mongoose.models.Comment ||
mongoose.model("Comment", commentSchema);