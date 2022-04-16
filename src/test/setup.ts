import chai from 'chai'
import chaiHttp from 'chai-http';
import stubFirebase from './stubs/firebase.js';

chai.use(chaiHttp);

before(() => {
  // This will be executed before all tests in this block
  stubFirebase();

})