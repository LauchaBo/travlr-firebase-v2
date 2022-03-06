import { InitializeApp } from 'firebase/app';
import { getAuth, onAuthStateCHanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc } from 'firebase/firestore';

const firebaseApp = InitializeApp({
  projectId: 'travlr-61d7f',
  appId: '1:86329584280:web:19ac31cf1bccce32313eed',
  databaseURL: 'https://travlr-61d7f.firebaseio.com',
  storageBucket: 'travlr-61d7f.appspot.com',
  locationId: 'us-east1',
  apiKey: 'AIzaSyC3LO_w5TGOUYTG4hLASD6fR7Y1zGRPH7I',
  authDomain: 'travlr-61d7f.firebaseapp.com',
  messagingSenderId: '86329584280',
  measurementId: 'G-NFSKTEG1GC'
});
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Detect auth state
onAuthStateCHanged(auth, user => {
  if(user !== null) {
    console.log('logged in!');
  } else {
    console.log('No user');
  }
})

async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

const specialOfTheDay = doc(db, 'dailySpecial/2021-09-14');

export const writeDailySpecial = () => {
  const docData = {
    description: 'A delicius vanilla latte',
    price: 3.99,
    milk: 'Whole',
    vegan: false
  };
  setDoc(specialOfTheDay, docData);
}

export default db;
export { auth };
// export {writeDailySpecial};