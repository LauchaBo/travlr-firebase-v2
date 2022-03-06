const functions = require("firebase-functions");
const admin = require('firebase-admin');
// const auth = require('../src/index');

const firestore = admin.firestore();

exports.create = functions.https.onRequest((req, res) => {
  // errors = []
  // if (!req.body.email || !validator.isEmail(req.body.email) || validator.isEmpty(req.body.email)) {
  //   errors.push({code: 'invalid', field: 'email', message: 'Invalid email'})
  // }
  // if (!req.body.firstName ||validator.isEmpty(req.body.firstName)) {
  //   errors.push({code: 'required', field: 'firstName', message: 'First name is required'})
  // }
  // if (!req.body.lastName ||validator.isEmpty(req.body.lastName)) {
  //   errors.push({code: 'required', field: 'lastName', message: 'First name is required'})
  // }
  // if (errors.length > 0) {
  //   res.status(400).send(errors)
  // }
  const user = {
    email: req.body.email,
    emailVerified: false,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    disabled: false,
    photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    isDeleted: false
  }
  admin.auth().createUser(user)
    .then(userRecord => {
      console.log('Successfully created new user:', userRecord.uid)
      delete user.password
      firestore.collection('users').doc(userRecord.uid).set(user)
      res.status(200).send(user)
      return
    })
    .catch(error => {
      console.log('Error creating new user:', error)
      res.status(500).send(error)
    });
  }
)

// El login hay que pasarlo a un auth fuera de entities
exports.logIn = functions.https.onRequest((req, res) => {
  // errors = []
  // if (!req.body.email || !validator.isEmail(req.body.email) || validator.isEmpty(req.body.email)) {
  //   errors.push({code: 'invalid', field: 'email', message: 'Invalid email'})
  // }
  // if (errors.length > 0) {
  //   res.status(400).send(errors)
  // }
  // Esto no funciona porque el getAuth no tiene el signIn
  auth.getAuth().signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(userCredentials => {
      console.log('Successfully logged in:', userCredentials)
      res.status(200).send(userCredentials)
      return
    })
    .catch(error => {
      console.log('Error logging in user:', error)
      res.status(500).send(error)
    })
  }
)

exports.read = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`users/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('Document retrieved successfully.');
      res.status(200).send(documentSnapshot);
    } else {
      res.status(404).send('Document not found.')
    }
  });
})

exports.update = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`users/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update(req.body).then(res => {
        console.log(`Document updated at time: ${res._writeTime._seconds}`);
      });
    }
    res.status(200).send();
  });
})

// En este delete qué hacemos en el auth? Disable o delete? El delete es baja física ahí.
exports.delete = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`users/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update({isDeleted: true}).then(res => {
        console.log(`Document deleted at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });
})