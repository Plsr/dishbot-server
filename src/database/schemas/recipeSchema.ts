import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title:  String,
  description: String,
  userId:   String,
  ingredients: [{ name: String, amount: Number, unit: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default recipeSchema
