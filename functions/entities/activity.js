const functions = require("firebase-functions");
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.create = functions.https.onRequest((req, res) => {
  errors = []
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  const activity = {
    name: req.body.name,
    location: req.body.location,
    landmark: req.body.landmark,
    notes: req.body.notes,
    users: req.body.users,
    date: req.body.date,
    categories: req.body.categories,
    saves: req.body.saves,
    isDeleted: false
  }
  try {
    const journeyID = req.params[0].split('/')[1];
    const itineraryID = req.params[0].split('/')[3];
    let journeyRef = firestore.doc(`journeys/${journeyID}`);
    journeyRef.get().then(journeySnapshot => {
      if (!journeySnapshot.exists) {
        console.log(`Journey doesn't exist!`);
        res.status(404).send('Journey not found.');
      } else {
        let itineraryRef = firestore.doc(`journeys/${journeyID}/itineraries/${itineraryID}`);
        itineraryRef.get().then(itinerarySnapshot => {
          if (!itinerarySnapshot.exists) {
            console.log(`Itinerary doesn't exist!`);
            res.status(404).send('Itinerary not found.');
          } else {
            let activityRef = itineraryRef.collection('activities');
            activityRef.add(activity).then(documentReference => {
              console.log(`Added document at '${documentReference.path}'`);
            });
            res.status(200).send(activity);
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
  const journeyID = req.params[0].split('/')[1];
  const itineraryID = req.params[0].split('/')[3];
  const activityID = req.params[0].split('/')[5];
  let documentRef = firestore.doc(`journeys/${journeyID}/itineraries/${itineraryID}/activities/${activityID}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('Document retrieved successfully.');
      res.status(200).send(documentSnapshot);
    }
  });
})

exports.update = functions.https.onRequest((req, res) => {
  const journeyID = req.params[0].split('/')[1];
  const itineraryID = req.params[0].split('/')[3];
  const activityID = req.params[0].split('/')[5];
  let documentRef = firestore.doc(`journeys/${journeyID}/itineraries/${itineraryID}/activities/${activityID}`);
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
  const journeyID = req.params[0].split('/')[1];
  const itineraryID = req.params[0].split('/')[3];
  const activityID = req.params[0].split('/')[5];
  let documentRef = firestore.doc(`journeys/${journeyID}/itineraries/${itineraryID}/activities/${activityID}`);
  documentRef.get().then(documentSnapshot => {
    if (documentSnapshot.exists) {
      documentRef.update({isDeleted: true}).then(res => {
        console.log(`Document deleted at ${res.updateTime}`);
      });
    }
    res.status(200).send();
  });
})