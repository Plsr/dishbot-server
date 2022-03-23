import Recipe, { IRecipe } from "./schemas/recipeSchema.js";

// TODO: Better typings for arguments
export async function addRecipe(recipe: any, user: any): Promise<IRecipe> {
  try {
    const newRecipe = await Recipe.create({ ...recipe, userId: user.user_id })
    return newRecipe
  } catch (error: any) {
    console.error(error)
    throw (error)
  }
}
