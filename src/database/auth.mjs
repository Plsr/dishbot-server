import adminApp from '../util/firebase.mjs'

export async function createUser(email, password) {
  console.log(adminApp.auth())
  const user = await adminApp.auth().createUser({
    email,
    password
  })

  return user
}