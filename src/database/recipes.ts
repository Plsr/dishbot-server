import mongoose from "mongoose";
import recipeSchema from "./schemas/recipeSchema.js";

// TODO: This is weird
const Recipe = mongoose.model<typeof recipeSchema>('Recipe', recipeSchema)

// TODO: Better typings for arguments
export async function addRecipe(recipe: any, user: any) {
  // TODO: Validation
  const newRecipe = new Recipe({ ...recipe, userId: user.user_id })
  const createdRecipe = await newRecipe.save()
  return createdRecipe
}
