import adminApp from '../util/firebase.mjs'
const SKIP_PATHNAMES = []

const validateToken = async (req, res, next) => {
  const token = req.token
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