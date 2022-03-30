import mongoose from 'mongoose'

export async function startDatabase() {
  const connectionString = process.env.NODE_ENV == 'test' 
    ? process.env.MONGO_CONNECTION_STRING_TEST
    : process.env.MONGO_CONNECTION_STRING
  await mongoose.connect(connectionString as string);
}

export async function getDataBase() {
  return undefined
}