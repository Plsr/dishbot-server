import mongoose from 'mongoose'

export interface Recipe extends mongoose.Document {
  title: string,
  description?: string,
  userId: string,
  ingredients: [Ingredient],
  createdAt: Date,
  updatedAt: Date
}

export type RequestRecipe = Omit<Recipe, 'userId' | 'createdAt' | 'updatedAt'>

export interface Ingredient {
  name: String,
  amount: Number,
  unit: String
}
