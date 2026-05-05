import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({

 userId:{
  type: mongoose.Schema.Types.ObjectId,
  ref: "signupdata",
  required:true
 },

 photoId:{
  type: mongoose.Schema.Types.ObjectId,
  ref: "progressPhoto",
  required:true
 }

});

export default mongoose.models.Like ||
mongoose.model("Like", likeSchema);