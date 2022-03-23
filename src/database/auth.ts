import adminApp from '../util/firebase.js'

export async function createUser(email: string, password: string) {
  console.log(adminApp.auth())
  const user = await adminApp.auth().createUser({
    email,
    password
  })

  return user
}
