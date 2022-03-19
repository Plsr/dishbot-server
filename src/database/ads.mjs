import { ObjectId } from 'mongodb';
import { getDataBase } from './mongo.mjs';

const collectionName = 'ads'

export async function insertAd(ad) {
  const database = await getDataBase();
  const { insertedId } = await database.collection(collectionName).insertOne(ad)
  return insertedId
}

export async function getAds() {
  const database = await getDataBase()
  return await database.collection(collectionName).find({}).toArray()
}

export async function deleteAd(id) {
  const database = await getDataBase()
  await database.collection(collectionName).deleteOne({
    _id: new ObjectId(id)
  })
}

export async function updateAd(id, ad) {
  const database = await getDataBase()
  delete ad._id
  await database.collection(collectionName).update(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...ad,
      }
    }
  )
}