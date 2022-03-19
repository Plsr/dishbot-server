import adminApp from '../util/firebase.mjs'

export async function createUser(email, password) {
  console.log(adminApp.auth())
  const user = await adminApp.auth().createUser({
    email,
    password
  })

  return user
}

export async function validateToken(token) {
  try {
    const res = await adminApp.auth().verifyIdToken(token)
    return {
      email: res.email,
      id: res.uid
    }
  } catch (error) {
    console.error(error)
    return false
  }
}