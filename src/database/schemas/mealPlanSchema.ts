
import mongoose from "mongoose";
import { MealPlan as MealPlanInterface } from "../../types/mealPlan";

const mealPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  recipes: {
    type: [
      {
        ref: "Recipe",
        type: mongoose.Schema.Types.ObjectId,
      }
    ],
    validate: {
      validator: (i: [{}]) => Array.isArray(i) && i.length > 0,
      message: 'Recipes cannot be empty'
    }
  },
  isCurrent: {
    type: Boolean,
    required: true,
    default: false
  },
  shoppingList: {
    ref: "ShoppingList",
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const MealPlan: mongoose.Model<MealPlanInterface> = mongoose.model("MealPlan", mealPlanSchema);
export default MealPlan