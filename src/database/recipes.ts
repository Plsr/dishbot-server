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

export async function getRecipes(userIdToken: admin.auth.DecodedIdToken): Promise<RecipeInterface[]> {
  return await Recipe.find({ userId: userIdToken.user_id })
}

export async function getRecipe(userIdToken: admin.auth.DecodedIdToken, id: string): Promise<RecipeInterface | undefined | null > {
  return await Recipe.findOne({ userId: userIdToken.user_id, _id: id })
}

export async function deleteRecipe(userIdToken: admin.auth.DecodedIdToken, id: string): Promise<boolean> {
  const res = await Recipe.deleteOne({ userId: userIdToken.user_id, _id: id })
  return res.deletedCount > 0
}

export async function updateRecipe(userIdToken: admin.auth.DecodedIdToken, id: string, recipe: RequestRecipe, ): Promise<RecipeInterface | false> {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      {
        userId: userIdToken.user_id,
        _id: id
      },
      {
        ...recipe,
        updatedAt: new Date()
      },
      {
        new: true
      }
    )
    return updatedRecipe || false
  } catch (error: any) {
    console.error(error)
    throw (error)
  }
}

