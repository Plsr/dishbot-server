import chai from 'chai'
import chaiSubest from 'chai-subset'
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import server from '../index.js'
import MealPlan from '../database/schemas/mealPlanSchema.js'
import Recipe from '../database/schemas/recipeSchema.js'

chai.use(chaiSubest)
const should = chai.should()

describe('Meal Plans', () => {
  let mongoServer: MongoMemoryServer

  const recipeData = {
    title: 'Some recipe',
    description: 'A very tasty one',
    ingredients: [
      { name: 'Bread', amount: 1, unit: 'pcs' },
      { name: 'Avocado', amount: 1, unit: 'pcs' }
    ]
  }


  beforeEach((done) => {
    MealPlan.deleteMany({}, (_err) => {
      done();
    })
  })

  before(async() => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  })

  after(async() => {
    await mongoose.disconnect();
    await mongoServer.stop();
  })

  describe('GET meal plans', () => {
    it('should return empty array if no meal plans present', (done) => {
      chai.request(server)
      .get('/meal-plans')
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.own.property('mealPlans')
        res.body.mealPlans.should.be.a('array');
        res.body.mealPlans.length.should.be.eql(0);
        done()
      })
    })

    it('should get all the meal plans',  async () => {
      const recipes = await Recipe.create([
        { ...recipeData, userId: 'asd' },
        { ...recipeData, userId: 'asd' },
      ])
      const recipeIds = recipes.map(recipe => recipe._id)
      const _mealPlan = await MealPlan.create({
        userId: 'asd',
        recipes: [...recipeIds]
      })

      const res = await chai.request(server).get('/meal-plans').send()
      res.should.have.status(200)
      res.body.should.have.own.property('mealPlans')
      res.body.mealPlans.should.be.a('array');
      res.body.mealPlans.length.should.be.eql(1);
    })
  })

  describe('POST meal plans', () => {
    it('should create a meal plan with valid data', async () => {
      const recipes = await Recipe.create([
        { ...recipeData, userId: 'asd' },
        { ...recipeData, userId: 'asd' },
      ])
      const recipeIds = recipes.map(recipe => recipe._id.toString())
      const mealPlanData = {
        userId: 'asd',
        recipes: [...recipeIds]
      }

      const res = await chai.request(server).post('/meal-plans').send(mealPlanData)
      res.should.have.status(201)
      res.body.should.have.own.property('mealPlan')
      res.body.mealPlan.should.containSubset(mealPlanData)
      const createdMealPlan = await MealPlan.find({ id: res.body.id })
      createdMealPlan.should.exist  
    })

    it('should not create a meal plan with invalid data', async () => {
      console.log('called')
      const mealPlanData = {
        userId: 'asd',
        recipes: []
      }

      const res = await chai.request(server).post('/meal-plans').send(mealPlanData)
      res.should.have.status(400)
      res.body.should.have.own.property('errors')
      res.body.errors.should.have.own.property('recipes')
    })
  })
})