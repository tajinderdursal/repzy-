import mongoose from "mongoose";

const progressPhotoSchema = new mongoose.Schema({

 userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"signupdata",
  required:true
 },

 image:{
  type:String,
  required:true
 },
 
 publicId: {
  type: String,
},

 caption:{
  type:String,
  default:""
 },

 createdAt:{
  type:Date,
  default:Date.now
 },
 
 isPublic:{
 type:Boolean,
 default:false
},


});

export default mongoose.models.progressPhoto ||
mongoose.model("progressPhoto",progressPhotoSchema);