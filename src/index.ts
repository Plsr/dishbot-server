import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import bearerToken from 'express-bearer-token';
import { config } from 'dotenv'
import { startDatabase } from './database/mongo.js';
import { createUser } from './database/auth.js';
import validateToken from './middleware/validateToken.js';
import mongoose from 'mongoose'
import { addRecipe } from './database/recipes.js'

config()
const app = express();

app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))
app.use(bearerToken())
app.use(validateToken)


declare module 'express-serve-static-core' {
  interface Request {
   user?: Object
  }
}
app.post('/users', async(req,res) => {
  const {
    email,
    password
  } = req.body
  const user = await createUser(email, password)
  console.log(user)
  res.send({ message: 'User created', user })
})

app.post('/token', (req, res) => {
  res.send(req.user)
})

app.post('/recipes', async(req, res) => {
  try {
    const recipe = await addRecipe(req.body, req.user)
    res.status(201).send({ recipe })
  } catch (error) {
    res.status(400).send(error)
  }
})


const kittySchema = new mongoose.Schema({
  name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

startDatabase().then(async () => {
  // await insertAd({ title: "Hello, now from in memory database" })
  // const silence = new Kitten({ name: 'Silence' });
  // console.log(silence.name); // 'Silence'
  // await silence.save()

  app.listen(process.env.PORT || 3000, () => {
    console.log('listening to port 3000')
  })
})
