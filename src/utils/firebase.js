import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyDO-F72RUGa2v57aVA0lH4wt4H-ryw7bvc',
  authDomain: 'repo-explorer.firebaseapp.com',
  databaseURL: 'https://repo-explorer.firebaseio.com',
  projectId: 'repo-explorer',
  storageBucket: 'repo-explorer.appspot.com',
  messagingSenderId: '288133352996',
};

firebase.initializeApp(config);
const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

export const { auth } = firebase;
export default firebase.firestore();
