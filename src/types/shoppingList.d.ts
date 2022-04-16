import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Ingredient } from './reicpe'

export interface ShoppingList extends mongoose.Document {
  userId: ObjectId;
  mealPlanId: ObjectId;
  items: [Ingredient],
  createdAt: Date,
  updatedAt: Date,
}