import Router from 'express'
import { addMealPlan, getMealPlans, getCurrentMealPlan } from '../database/mealPlans.js'

const mealPlansRouter = Router()

mealPlansRouter.post('/', async(req, res) => {
  try {
    const mealPlan = await addMealPlan(req.body, req.userIdToken!)
    res.status(201).send({ mealPlan })
  } catch (error) {
    res.status(400).send(error)
  }
})

mealPlansRouter.get('/', async(req, res) => {
  try {
    const mealPlans = await getMealPlans(req.userIdToken!)
    res.send({ mealPlans })
  } catch (error) {
    res.status(400).send(error)
  }
})

mealPlansRouter.get('/current', async(req, res) => {
  try {
    const currentMealPlan = await getCurrentMealPlan(req.userIdToken!)
    if (currentMealPlan) {
      res.send({ currentMealPlan })
    } else {
      res.status(404).end()
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

export default mealPlansRouter
