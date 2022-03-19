import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

let database = null

export async function startDatabase() {
  const mongo = await MongoMemoryServer.create()
  const connection = await MongoClient.connect(mongo.getUri(), { useNewUrlParser: true })
  database = connection.db()
}

export async function getDataBase() {
  if(!database) await startDatabase();
  return database
}