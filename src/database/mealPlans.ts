import admin from 'firebase-admin'
import { ObjectId } from 'mongodb';
import { RequestMealPlan, MealPlan as MealPlanInterface } from "../types/mealPlan";
import { Ingredient } from '../types/reicpe.js';
import MealPlan from './schemas/mealPlanSchema.js';
import Recipe from './schemas/recipeSchema.js';
import ShoppingList from './schemas/shoppingListSchema.js';

export async function addMealPlan(mealPlan: RequestMealPlan,  userIdToken: admin.auth.DecodedIdToken): Promise<MealPlanInterface> {
  try {
    const oldCurrentMealPlans = await MealPlan.find({ userId: userIdToken.user_id, isCurrent: true }).exec()

    const newMealPlan = await MealPlan.create(
      {
        ...mealPlan,
        userId: userIdToken.user_id,
        isCurrent: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    )

    await MealPlan.updateMany({ _id: {$in: oldCurrentMealPlans} }, { $set: { isCurrent: false }})
    const mealPlanIngredients = await getMealPlanIngredients(newMealPlan.recipes)

    const shoppingList = await ShoppingList.create({
      userId: userIdToken.user_id,
      items: mealPlanIngredients,
      mealPlanId: newMealPlan._id
    })

    const updatedNewMealPlan = await MealPlan
      .findByIdAndUpdate(newMealPlan._id, { shoppingList: shoppingList._id }, { new: true })
      .populate('recipes')
      .populate('shoppingList')
      .exec()
    if (!updatedNewMealPlan) throw new Error('Meal plan to add shopping list to not found')

    return updatedNewMealPlan
  } catch (error: any) {
    console.error(error)
    throw (error)
  }
}

export async function getMealPlans(userIdToken: admin.auth.DecodedIdToken): Promise<MealPlanInterface[]> {
  return await MealPlan.find({ userId: userIdToken.user_id })
}

export async function getCurrentMealPlan(userIdToken: admin.auth.DecodedIdToken): Promise<MealPlanInterface | null> {
  return await MealPlan
    .findOne({ userId: userIdToken.user_id, isCurrent: true })
    .populate('recipes')
    .populate('shoppingList')
    .exec()
}

async function getMealPlanIngredients(recipeIds: ObjectId[]): Promise<Ingredient[]> {
  const mealPlanRecipes = await Recipe.find({ _id: recipeIds })
  return mealPlanRecipes.map(recipe => recipe.ingredients).flat()
}
