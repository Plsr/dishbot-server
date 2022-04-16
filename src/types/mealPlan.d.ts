import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Recipe } from './reicpe'

export interface MealPlan extends mongoose.Document {
  title?: string;
  userId: ObjectId;
  recipes: [Recipe],
  isCurrent: boolean;
  shoppingList?: ObjectId, // TODO: ShoppingList type
  createdAt: Date,
  updatedAt: Date,
}

export type RequestMealPlan = Omit<MealPlan, 'userId' | 'createdAt' | 'updatedAt' | 'shoppingList' | 'isCurrent'>