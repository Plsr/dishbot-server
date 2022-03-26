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
    required: true
  },
  ingredients: {
    type: [{ name: String, amount: Number, unit: String }],
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

