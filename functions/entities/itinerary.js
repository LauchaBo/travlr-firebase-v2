const functions = require("firebase-functions");
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.create = functions.https.onRequest((req, res) => {
  errors = []
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  const itinerary = {
    day: req.body.day,
    isDeleted: false
  }
  try {
    const journeyID = req.params[0].split('/')[1]
    let journeyRef = firestore.doc(`journeys/${journeyID}`);
    journeyRef.get().then(journeySnapshot => {
      if (!journeySnapshot.exists) {
        console.log(`Journey doesn't exist!`);
        res.status(404).send('Journey not found.')
      } else {
        let itineraryRef = journeyRef.collection('itineraries');
        itineraryRef.add(itinerary).then(documentReference => {
          console.log(`Added document at '${documentReference.path}'`);
        });
        res.status(200).send(itinerary);
      }
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(400).send(e);
  }
})

exports.read = functions.https.onRequest((req, res) => {
  const journeyID = req.params[0].split('/')[1]
  const itineraryID = req.params[0].split('/')[3]
  let documentRef = firestore.doc(`journeys/${journeyID}/itineraries/${itineraryID}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('Document retrieved successfully.');
      res.status(200).send(documentSnapshot);
    }
  });
})

exports.update = functions.https.onRequest((req, res) => {
  const journeyID = req.params[0].split('/')[1]
  const itineraryID = req.params[0].split('/')[3]
  let documentRef = firestore.doc(`journeys/${journeyID}/itineraries/${itineraryID}`);
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
  const journeyID = req.params[0].split('/')[1]
  const itineraryID = req.params[0].split('/')[3]
  let documentRef = firestore.doc(`journeys/${journeyID}/itineraries/${itineraryID}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update({isDeleted: true}).then(res => {
        console.log(`Document deleted at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });
})