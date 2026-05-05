import mongoose from "mongoose";

const signupdataSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  age: Number,
  height: Number,
  weight: Number,
  gender: String,
  profilePhoto:{
 type:String,
 default:""

 
},
goal: String,
activity: String,

calorieGoal: Number,
proteinGoal: Number,
carbsGoal: Number,
fatGoal: Number,



}, { timestamps: true });

export default mongoose.models.signupdata || mongoose.model("signupdata", signupdataSchema);

