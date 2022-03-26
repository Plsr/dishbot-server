import admin from 'firebase-admin'
import Recipe from "./schemas/recipeSchema.js";
import { Recipe as RecipeInterface, RequestRecipe } from '../types/reicpe'

export async function addRecipe(recipe: RequestRecipe, userIdToken: admin.auth.DecodedIdToken): Promise<RecipeInterface> {
  try {
    const newRecipe = await Recipe.create(
      {
        ...recipe,
        userId: userIdToken.user_id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    )
    return newRecipe
  } catch (error: any) {
    console.error(error)
    throw (error)
  }
}
