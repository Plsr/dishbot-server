import adminApp from '../util/firebase.js'
const SKIP_PATHNAMES = []

// TODO: Typings
const validateToken = async (req: any, res: any, next: any) => {
  const token = req.token
  console.log(token)
  try {
    const verificationRes = await adminApp.auth().verifyIdToken(token)
    req.user = { ...verificationRes }
    next()
  } catch (error) {
    console.error(error)
    res.status(401).end()
  }
}

export default validateToken
