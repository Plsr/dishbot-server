import admin from 'firebase-admin'
import { RequestMealPlan, MealPlan as MealPlanInterface } from "../types/mealPlan";
import MealPlan from './schemas/mealPlanSchema.js';

// TODO: Create shopping list after meal plan creation
export async function addMealPlan(mealPlan: RequestMealPlan,  userIdToken: admin.auth.DecodedIdToken): Promise<MealPlanInterface> {
  try {
    const oldCurrentMealPlan = MealPlan.findOne({ userId: userIdToken.user_id, isCurrent: true })

    const newRecipe = await MealPlan.create(
      {
        ...mealPlan,
        userId: userIdToken.user_id,
        isCurrent: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    )

    oldCurrentMealPlan.update({ isCurrent: false })
    return newRecipe
  } catch (error: any) {
    console.error(error)
    throw (error)
  }
}

export async function getMealPlans(userIdToken: admin.auth.DecodedIdToken): Promise<MealPlanInterface[]> {
  return await MealPlan.find({ userId: userIdToken.user_id })
}