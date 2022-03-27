import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import bearerToken from 'express-bearer-token';
import { config } from 'dotenv'
import { startDatabase } from './database/mongo.js';
import validateToken from './middleware/validateToken.js';
import recipesRouter from './routes/recipes.js'

// TODO: Global error handler?

// Setup
config()
const app = express();

// Middlewares
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))
app.use(bearerToken())
app.use(validateToken)

// Routes
app.use('/recipes', recipesRouter)

app.post('/token', (req, res) => {
  res.send(req.userIdToken)
})

startDatabase().then(async () => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening to port 3000')
  })
})
