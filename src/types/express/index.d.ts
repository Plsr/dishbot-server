import admin from 'firebase-admin'

declare global {
  namespace Express {
    interface Request {
      userIdToken?: admin.auth.DecodedIdToken
    }
  }
}
