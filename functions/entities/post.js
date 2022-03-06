const functions = require("firebase-functions");
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.create = functions.https.onRequest((req, res) => {
  errors = []
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  const post = {
    owner: req.body.owner,
    date: new Date(),
    text: req.body.text,
    //esto no sé si es el landmarkID o el nombre
    landmark: req.body.landmark,
    likes: 0,
    mediaURLs: req.body.mediaURLs,
    isDeleted: false
  }
  try {
    let collectionRef = firestore.collection('posts');
    collectionRef.add(post).then(documentReference => {
      console.log(`Added document at '${documentReference.path}'`);
    });
    res.status(200).send(post);
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(400).send(e);
  }
})

exports.read = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`posts/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('Document retrieved successfully.');
      res.status(200).send(documentSnapshot);
    }
  });
})

exports.update = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`posts/${id}`);
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
  let documentRef = firestore.doc(`posts/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update({isDeleted: true}).then(res => {
        console.log(`Document updated at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });})