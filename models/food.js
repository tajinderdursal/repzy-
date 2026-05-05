import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signupdata",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  calories: {
    type: Number,
    required: true,
  },

  protein: {
    type: Number,
    default: 0,
  },

  carbs: {
    type: Number,
    default: 0,
  },

  fat: {
    type: Number,
    default: 0,
  },

  quantity: {
    type: Number,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  meal: {
  type: String,
  enum: ["breakfast", "lunch", "dinner", "snacks"],
  default: "breakfast",
},
});

export default mongoose.models.Food || mongoose.model("Food", FoodSchema);