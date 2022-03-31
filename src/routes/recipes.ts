import { Router } from 'express'
import { addRecipe, getRecipes, getRecipe, deleteRecipe, updateRecipe } from '../database/recipes.js'

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

recipesRouter.delete('/:id', async(req, res) => {
  try {
    const deleted = await deleteRecipe(req.userIdToken!, req.params.id)
    deleted ? res.status(204).end() : res.status(403).end()
  } catch (error) {
    res.status(500).end()
  }
})

recipesRouter.patch('/:id', async(req, res) => {
  try {
    const recipe = await updateRecipe(req.userIdToken!, req.params.id, req.body)
    recipe ? res.send({ recipe }) : res.status(403).end()
  } catch (error) {
    res.status(400).send(error)
  }
})

export default recipesRouter
