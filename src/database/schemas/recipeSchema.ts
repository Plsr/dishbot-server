import mongoose from 'mongoose';
import { Recipe as RecipeInterface } from '../../types/reicpe.d'

const recipeSchema = new mongoose.Schema({
  title:  {
    type: String,
    required: true
  },
  description: String,
  userId: {
    type: String,
    required: true,
    index: true
  },
  ingredients: {
    type: [
      {
        name: { type: String, required: [true, "Ingredient name is required"] },
        amount: { type: Number, required: [true, "Ingredient amount is required"] },
        unit: { type: String, required: [true, "Ingredient unit is required"] }
      }
    ],
    required: true,
    validate: {
      validator: (i: [{}]) => Array.isArray(i) && i.length > 0,
      message: 'Ingredients cannot be empty'
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Recipe: mongoose.Model<RecipeInterface> = mongoose.model('Recipe', recipeSchema)

export default Recipe

