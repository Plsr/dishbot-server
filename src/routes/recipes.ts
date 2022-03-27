import { Router } from 'express'
import { addRecipe, getRecipes } from '../database/recipes.js'

const recipesRouter = Router()

recipesRouter.get('/', async (req, res) => {
  try {
    const recipes = await getRecipes(req.userIdToken!)
    res.send({ recipes })
  } catch(error) {
    res.status(400).send(error)
  }
})

recipesRouter.post('/', async(req, res) => {
  try {
    const recipe = await addRecipe(req.body, req.userIdToken!)
    res.status(201).send({ recipe })
  } catch (error) {
    res.status(400).send(error)
  }
})

export default recipesRouter
