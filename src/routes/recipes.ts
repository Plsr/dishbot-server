import { Router } from 'express'
import { addRecipe, getRecipes, getRecipe } from '../database/recipes.js'

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

recipesRouter.get('/:id', async(req, res) => {
  try {
    const recipe = await getRecipe(req.userIdToken!, req.params.id)
    if (!recipe) throw new Error()
    res.send({ recipe })
  } catch (error) {
    res.status(404).end()
  }
})

export default recipesRouter
