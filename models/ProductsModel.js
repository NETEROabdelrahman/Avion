import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required:true
  },
  desc: {
    type: String,
    required:true
  },
  photos: {
    type: [String]
  },
  descPoints: { type: [String], required: false },
  height: {
    type: Number,
    required:false
  },
  width: {
    type: Number,
    required:false
  },
  depth: {
    type: Number,
    required:false
  },
  amount: {
    type: Number,
    required:true
  }
});

export default mongoose.model("Product", ProductSchema)