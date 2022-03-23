import mongoose from 'mongoose'


export async function startDatabase() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string);
}

export async function getDataBase() {
  return undefined
}