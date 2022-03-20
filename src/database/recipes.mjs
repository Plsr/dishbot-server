import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import recipeSchema from "./schemas/recipeSchema.mjs";

const Recipe = new mongoose.model('Recipe', recipeSchema)

export async function addRecipe(recipe, user) {
  // TODO: Validation
  const newRecipe = new Recipe({ ...recipe, userId: user.user_id })
  const createdRecipe = await newRecipe.save()
  return createdRecipe
}