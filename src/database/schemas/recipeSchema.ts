import mongoose from 'mongoose';

export interface IRecipe extends mongoose.Document {
  title: string,
  description?: string,
  userId: string,
  ingredients: [IIngredient],
  createdAt: Date,
  updatedAt: Date
}

export interface IIngredient {
  name: String,
  amount: Number,
  unit: String
}

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

const Recipe: mongoose.Model<IRecipe> = mongoose.model('Recipe', recipeSchema)

export default Recipe

