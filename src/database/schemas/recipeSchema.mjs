import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
const { Schema } = mongoose;

const recipeSchema = new Schema({
  title:  String,
  description: String,
  userId:   String,
  ingredients: [{ name: String, amount: Number, unit: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default recipeSchema