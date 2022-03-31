/**
 * TODO:
 * - [ ] move stubs out of here
 * - [x] test GET recipes when recipes present
 * - [x] test /POST recipe happy path
 * - [x] test /POST recipe error path
 * - [ ] test /DELETE recipe
 * - [ ] test /PATCH (or PUT?) recipe path
 */

import firebase from '../util/firebase.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiSubest from 'chai-subset'
import sinon from 'sinon'
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import server from '../index.js'
import Recipe from '../database/schemas/recipeSchema.js'

const should = chai.should()
chai.use(chaiHttp);
chai.use(chaiSubest)

sinon.stub(firebase.auth)

sinon.stub(firebase.auth(), 'verifyIdToken').resolves({
  iss: 'https://securetoken.google.com/project123456789',
  aud: 'project123456789',
  auth_time: Math.floor(new Date().getTime() / 1000),
  sub: 'userid',
  iat: Math.floor(new Date().getTime() / 1000),
  exp: Math.floor(new Date().getTime() / 1000 + 3600),
  firebase: {
    identities: {},
    sign_in_provider: 'custom',
  },
  uid: 'userid',
  user_id: 'asd'
})

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
      ])
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

    it('should only get recipes that belong to the user', (done) => {
      Recipe.create([
        { ...recipeRequestBody, userId: 'asd' },
        { ...recipeRequestBody, userId: 'hjk' },
      ])
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
        Recipe.findById(res.body._id).should.exist
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
      const recipeId = Recipe.create({ ...recipeRequestBody, userId: 'asd' }).then((recipe) =>{
        return recipe._id
      })

      chai.request(server)
      .get(`/recipes/${recipeId}`)
      .set('Authorization', 'Bearer foobarbaz')
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.own.property('recipe')
        res.body.recipe.should.containSubset(recipeRequestBody)
        done()
      })
    })

    it('does not get a recipe that belongs to other users', (done) => {
      const recipeId = Recipe.create({ ...recipeRequestBody, userId: 'hjk' }).then((recipe) =>{
        return recipe._id
      })

      chai.request(server)
      .get(`/recipes/${recipeId}`)
      .set('Authorization', 'Bearer foobarbaz')
      .end((_err, res) => {
        res.should.have.status(404)
        done()
      })
    })
  })

  describe('/DELETE recipe', () => {

  })
})



