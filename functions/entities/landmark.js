const functions = require("firebase-functions");
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.create = functions.https.onRequest((req, res) => {
  errors = []
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  const landmark = {
    name: req.body.name,
    //location debería ser el objeto en vez del string, no?
    location: req.body.location,
    description: req.body.description,
    phone: req.body.phone,
    //categories replicado adentro de landmark en vez de array de strings?
    categories: req.body.categories,
    bookmarks: 0,
    mainPhotoURL: req.body.mainPhotoURL,
    posts: req.body.posts,
    //collection de reviews, guardamos un max?
    reviews: req.body.reviews,
    isDeleted: false
  }
  try {
    let collectionRef = firestore.collection('landmarks');
    collectionRef.add(landmark).then(documentReference => {
      console.log(`Added document at '${documentReference.path}'`);
    });
    res.status(200).send(landmark);
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(400).send(e);
  }
})

exports.read = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`landmarks/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('Document retrieved successfully.');
      res.status(200).send(documentSnapshot);
    }
  });
})

exports.update = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`landmarks/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update(req.body).then(res => {
        console.log(`Document updated at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });
})

exports.delete = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`landmarks/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update({isDeleted: true}).then(res => {
        console.log(`Document updated at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });})