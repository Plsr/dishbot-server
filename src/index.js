import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import bearerToken from 'express-bearer-token';
import { config } from 'dotenv'
import { startDatabase } from './database/mongo.mjs';
import { getAds, insertAd, deleteAd, updateAd } from './database/ads.mjs';
import { createUser, validateToken } from './database/auth.mjs';

config()
const app = express();

const ads = [
  { title: 'Hello world (again)'}
]

app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))
app.use(bearerToken())

app.get('/', async (req, res) => {
  res.send(await getAds())
})

app.post('/', async (req, res) => {
  const newAd = req.body
  const newId = await insertAd(newAd)
  res.send({ message: "new ad inserted", ad: { ...newAd, _id: newId } })
})

app.post('/users', async(req,res) => {
  const {
    email,
    password
  } = req.body
  const user = await createUser(email, password)
  console.log(user)
  res.send({ message: 'User created', user })
})

app.post('/token', async(req, res) => {
  const token = req.token
  const validationRes = await validateToken(token)

  if (validationRes) {
    res.send(validationRes)
  } else {
    res.status(401).end()
  }
})

app.delete('/:id', async (req, res) => {
  await deleteAd(req.params.id)
  res.send({ message: 'Ad removed' })
})

app.put('/:id', async (req, res) => {
  const updatedAd = req.body
  await updateAd(req.params.id, updatedAd)
  res.send({ message: 'Ad updated' })
})


startDatabase().then(async () => {
  await insertAd({ title: "Hello, now from in memory database" })

  app.listen(process.env.PORT || 3000, () => {
    console.log('listening to port 3000')
  })
})