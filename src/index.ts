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
if (process.env.NODE_ENV !== 'test') {
  startDatabase()
}

// Middlewares
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined', {
  skip: () => process.env.NODE_ENV === 'test'
}))
app.use(bearerToken())
app.use(validateToken)

// Routes
app.use('/recipes', recipesRouter)

app.post('/token', (req, res) => {
  res.send(req.userIdToken)
})

// TODO: Env file for test
const port = process.env.NODE_ENV == 'test' ? 3008 : process.env.PORT
app.listen(port, () => {
  console.log('listening to port ', port)
})

export default app
