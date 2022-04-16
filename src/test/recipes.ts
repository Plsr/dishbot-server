import chai from 'chai'
import chaiSubest from 'chai-subset'
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import server from '../index.js'
import Recipe from '../database/schemas/recipeSchema.js'

chai.use(chaiSubest)
const should = chai.should()

describe('Recipes', () => {
  let mongoServer: MongoMemoryServer

  const recipeRequestBody = {
    title: 'Some recipe',
    description: 'A very tasty one',
    ingredients: [
      { name: 'Bread', amount: 1, unit: 'pcs' },
      { name: 'Avocado', amount: 1, unit: 'pcs' }
    ]
  }

  beforeEach((done) => {
    Recipe.deleteMany({}, (err) => {
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

  describe('/GET recipes', () => {
    it('should return empty array if no recipes present', (done) => {
      chai.request(server)
      .get('/recipes')
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.own.property('recipes')
        res.body.recipes.should.be.a('array');
        res.body.recipes.length.should.be.eql(0);
        done()
      })
    })

    it('should get all the recipes', (done) => {
      Recipe.create([
        { ...recipeRequestBody, userId: 'asd' },
        { ...recipeRequestBody, userId: 'asd' },
      ]).then(() => {
        chai.request(server)
        .get('/recipes')
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.have.own.property('recipes')
          res.body.recipes.should.be.a('array');
          res.body.recipes.length.should.be.eql(2);
          done()
        })
      })
    })

    it('should only get recipes that belong to the user', (done) => {
      Recipe.create([
        { ...recipeRequestBody, userId: 'asd' },
        { ...recipeRequestBody, userId: 'hjk' },
      ]).then(() => {
        chai.request(server)
        .get('/recipes')
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.have.own.property('recipes')
          res.body.recipes.should.be.a('array');
          res.body.recipes.length.should.be.eql(1);
          done()
        })
      })
    })
  })

  describe('/POST recipes', () => {
    it('should create a new recipe with valid data', (done) => {
      console.log(recipeRequestBody)
      chai.request(server)
      .post('/recipes')
      .set('Authorization', 'Bearer foobarbaz')
      .send({ ...recipeRequestBody })
      .end((_err, res) => {
        res.should.have.status(201)
        res.body.recipe.should.containSubset(recipeRequestBody)
        Recipe.findById(res.body._id).then(recipe => recipe!.should.exist)
        done()
      })
    })

    it('should not create a new recipe without title', (done) => {
      chai.request(server)
      .post('/recipes')
      .set('Authorization', 'Bearer foobarbaz')
      .send({ ...recipeRequestBody, title: undefined })
      .end((_err, res) => {
        res.should.have.status(400)
        res.body.should.have.own.property('errors')
        res.body.name.should.equal('ValidationError')
        done()
      })
    })

    it('should not create a new recipe without ingredients', (done) => {
      chai.request(server)
      .post('/recipes')
      .set('Authorization', 'Bearer foobarbaz')
      .send({ ...recipeRequestBody, ingredients: [] })
      .end((_err, res) => {
        res.should.have.status(400)
        res.body.should.have.own.property('errors')
        res.body.name.should.equal('ValidationError')
        done()
      })
    })
  })

  describe('/GET recipe', () => {
    it('GETs a single recipe', (done) => {
      Recipe.create({ ...recipeRequestBody, userId: 'asd' }).then((recipe) => {
        chai.request(server)
        .get(`/recipes/${recipe._id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.have.own.property('recipe')
          res.body.recipe.should.containSubset(recipeRequestBody)
          done()
        })
      })

      
    })

    it('does not get a recipe that belongs to other users', (done) => {
      Recipe.create({ ...recipeRequestBody, userId: 'hjk' }).then((recipe) =>{
        chai.request(server)
        .get(`/recipes/${recipe.id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .end((_err, res) => {
          res.should.have.status(404)
          done()
        })
      })

      
    })
  })

  describe('/DELETE recipe', () => {
    it('should delete a recipe', (done) => {
      Recipe.create({ ...recipeRequestBody, userId: 'asd' }).then((recipe) =>{
        chai.request(server)
        .delete(`/recipes/${recipe.id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .end((_err, res) => {
          res.should.has.status(204)
          Recipe.findById(recipe.id).then((recipe) => {
            console.log(recipe)
            should.not.exist(recipe)
            done()
          })
        })
      })
    })

    it('should not delete a recipe if it does not belong to the user', (done) => {
      Recipe.create({ ...recipeRequestBody, userId: 'hjk' }).then((recipe) =>{
        chai.request(server)
        .delete(`/recipes/${recipe.id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .end((_err, res) => {
          res.should.has.status(403)
          Recipe.findById(recipe.id).then((recipe) => {
            should.exist(recipe)
            done()
          })
        })
      })
    })
  })

  describe('/PATCH recipes', () => {
    it('updates recipes', (done) => {
      const updateRequest = {
        ...recipeRequestBody,
        title: 'foo',
        ingredients: [
          ...recipeRequestBody.ingredients,
          { name: 'bar', amount: 20, unit: 'g' }
        ]
      }

      Recipe.create({ ...recipeRequestBody, userId: 'asd' }).then((recipe) =>{
        chai.request(server)
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .send({ ...updateRequest })
        .end((_err, res) => {
          res.should.have.status(200)
          res.body.should.have.own.property('recipe')
          res.body.recipe.should.containSubset(updateRequest)
          done()
        })
      })
    })

    it('does not update recipes that do not belong to the user', (done) => {
      const updateRequest = {
        ...recipeRequestBody,
        title: 'foo',
        ingredients: [
          ...recipeRequestBody.ingredients,
          { name: 'bar', amount: 20, unit: 'g' }
        ]
      }

      Recipe.create({ ...recipeRequestBody, userId: 'hjk' }).then((recipe) => {
        chai.request(server)
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .send({ ...updateRequest })
        .end((_err, res) => {
          res.should.have.status(403)
          done()
        })
      })
    })

    it('does not update protected fields', (done) => {
      const updateRequest = {
        ...recipeRequestBody,
        createAt: new Date(),
        updatedAt: new Date(),
        userId: 'hjk'
      }

      Recipe.create({ ...recipeRequestBody, userId: 'asd' }).then((recipe) => {
        chai.request(server)
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .send({ ...updateRequest })
        .end((_err, res) => {
          res.should.have.status(200)
          Recipe.findById(recipe.id).then((recipe) => {
            recipe!.should.not.containSubset(updateRequest)
            done()
          })
        })
      })
    })

    it('does update the updatedAt field', (done) => {
      Recipe.create({ ...recipeRequestBody, userId: 'asd' }).then((recipe) => {
        const updatedAt = recipe.updatedAt
        chai.request(server)
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', 'Bearer foobarbaz')
        .send(recipeRequestBody)
        .end((_err, res) => {
          res.should.have.status(200)
          Recipe.findById(recipe.id).then((recipe) => {
            recipe!.updatedAt.should.not.equal(updatedAt)
            done()
          })
        })
      })
    })
  })
})



