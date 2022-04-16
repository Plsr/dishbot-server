import mongoose from "mongoose"
import { ShoppingList as ShoppingListInterface } from "../../types/shoppingList"

const shoppingListSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mealPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: {
    type: [
      // TODO: DRY
      {
        name: { type: String, required: [true, "Ingredient name is required"] },
        amount: { type: Number, required: [true, "Ingredient amount is required"] },
        unit: { type: String, required: [true, "Ingredient unit is required"] }
      }
    ],
    validate: {
      validator: (i: [{}]) => Array.isArray(i) && i.length > 0,
      message: "Items cannot be empty",
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const ShoppingList: mongoose.Model<ShoppingListInterface> = mongoose.model("ShoppingList", shoppingListSchema)
export default ShoppingList