import sinon from 'sinon'
import firebase from '../../util/firebase.js'

export default function stub() {
  sinon.stub(firebase.auth)

  sinon.stub(firebase.auth(), 'verifyIdToken').resolves({
    iss: 'https://securetoken.google.com/project123456789',
    aud: 'project123456789',
    auth_time: Math.floor(new Date().getTime() / 1000),
    sub: 'asd',
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000 + 3600),
    firebase: {
      identities: {},
      sign_in_provider: 'custom',
    },
    uid: 'asd',
    user_id: 'asd'
  })
}
