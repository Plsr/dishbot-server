/**
 * TODO:
 * - [ ] move stubs out of here
 * - [ ] test GET recipes when recipes present
 * - [x] test /POST recipe happy path
 * - [ ] test /POST recipe error path
 * - [ ] test /DELETE recipe
 * - [ ] test /PATCH (or PUT?) recipe path
 */

import firebase from '../util/firebase.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiSubest from 'chai-subset'
import sinon from 'sinon'

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
  beforeEach((done) => {
    Recipe.deleteMany({}, (err) => {
      done();
    })
  })

  describe('/GET recipes', () => {
    it('should get all the recipes', (done) => {
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
  })

  describe('/POST recipes', () => {
    it('should create a new recipe with valid data', (done) => {

      const recipeRequestBody = {
        title: 'Some recipe',
        description: 'A very tasty one',
        ingredients: [
          { name: 'Bread', amount: 1, unit: 'pcs' },
          { name: 'Avocado', amount: 1, unit: 'pcs' }
        ]
      }

      chai.request(server)
      .post('/recipes')
      .set('Authorization', 'Bearer foobarbaz')
      .send(recipeRequestBody)
      .end((_err, res) => {
        res.should.have.status(201)
        res.body.recipe.should.containSubset(recipeRequestBody)
      })
      Recipe.countDocuments({}, (_err: any, count: number) => {
        count.should.equal(1)
        done()
      })
    })
  })
})



