const functions = require("firebase-functions");
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.create = functions.https.onRequest((req, res) => {
  errors = []
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  const journey = {
    owner: req.body.owner,
    users: req.body.users,
    destination: req.body.destination,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    mainPhotoURL: req.body.mainPhotoURL,
    public: req.body.public,
    visits: req.body.visits,
    isDeleted: false
  }
  try {
    let collectionRef = firestore.collection('journeys');
    collectionRef.add(journey).then(documentReference => {
      console.log(`Added document at '${documentReference.path}'`);
    });
    res.status(200).send(journey);
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(400).send(e);
  }
})

exports.read = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`journeys/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('Document retrieved successfully.');
      res.status(200).send(documentSnapshot);
    }
  });
})

exports.update = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`journeys/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update(req.body).then(res => {
        console.log(`Document updated at time: ${res._writeTime._seconds}`);
      });
    }
    res.status(200).send();
  });
})

exports.delete = functions.https.onRequest((req, res) => {
  const id = req.params[0].split('/')[1]
  let documentRef = firestore.doc(`journeys/${id}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update({isDeleted: true}).then(res => {
        console.log(`Document deleted at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });
})