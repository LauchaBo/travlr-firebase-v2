const functions = require("firebase-functions");
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.create = functions.https.onRequest((req, res) => {
  errors = []
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  const savedLandmark = {
    landmarkID: req.body.landmarkID,
    name: req.body.name,
    mainPhotoURL: req.body.mainPhotoURL,
    categories: req.body.categories,
    notes: req.body.notes,
    isDeleted: false
  }
  try {
    const userID = req.params[0].split('/')[1];
    const bookmarkID = req.params[0].split('/')[3];
    let userRef = firestore.doc(`users/${userID}`);
    userRef.get().then(userSnapshot => {
      if (!userSnapshot.exists) {
        console.log(`User doesn't exist!`);
        res.status(404).send('User not found.');
      } else {
        let bookmarkRef = firestore.doc(`users/${userID}/bookmarks/${bookmarkID}`);
        bookmarkRef.get().then(bookmarkSnapshot => {
          if (!bookmarkSnapshot.exists) {
            console.log(`Bookmark doesn't exist!`);
            res.status(404).send('Bookmark not found.');
          } else {
            let savedLandmarkRef = bookmarkRef.collection('savedLandmarks');
            savedLandmarkRef.add(savedLandmark).then(documentReference => {
              console.log(`Added document at '${documentReference.path}'`);
            });
            res.status(200).send(savedLandmark);
          }
        });
      }
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(400).send(e);
  }
})

exports.read = functions.https.onRequest((req, res) => {
  const userID = req.params[0].split('/')[1];
  const bookmarkID = req.params[0].split('/')[3];
  const savedLandmarkID = req.params[0].split('/')[5];
  let documentRef = firestore.doc(`users/${userID}/bookmarks/${bookmarkID}/savedLandmarks/${savedLandmarkID}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('Document retrieved successfully.');
      res.status(200).send(documentSnapshot);
    }
  });
})

exports.update = functions.https.onRequest((req, res) => {
  const userID = req.params[0].split('/')[1];
  const bookmarkID = req.params[0].split('/')[3];
  const savedLandmarkID = req.params[0].split('/')[5];
  let documentRef = firestore.doc(`users/${userID}/bookmarks/${bookmarkID}/savedLandmarks/${savedLandmarkID}`);
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
  const userID = req.params[0].split('/')[1];
  const bookmarkID = req.params[0].split('/')[3];
  const savedLandmarkID = req.params[0].split('/')[5];
  let documentRef = firestore.doc(`users/${userID}/bookmarks/${bookmarkID}/savedLandmarks/${savedLandmarkID}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update({isDeleted: true}).then(res => {
        console.log(`Document deleted at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });
})