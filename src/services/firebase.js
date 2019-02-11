import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  databaseURL: process.env.REACT_APP_FIREBASE_DB,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
};

// firebase.initializeApp(config);

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.auth = firebase.auth;
    this.db = firebase.firestore();

    this.users = this.db.collection('users');
    this.views = this.db.collection('views');
  }

  getUserDoc() {
    return this.users.doc(this.auth().currentUser.uid).get().then((data) => {
      console.log(data)
    });
  }

  authenticate() {
    return this.auth().signInWithPopup(new this.auth.GithubAuthProvider()).then((result) => {
      const {
        additionalUserInfo: {
          profile,
        },
        user,
        credential,
      } = result;
      return this.users
        .doc(result.user.uid)
        .get()
        .then((doc) => { // eslint-disable-line
          if (doc.exists) {
            window.localStorage.setItem('rx-user-id', user.uid);
            window.localStorage.setItem('rx-user-token', credential.accessToken);
            return { user: { ...doc.data() }, token: credential.accessToken };
          }
          const newUser = {
            name: profile.name,
            email: profile.email,
            avatar: profile.avatar_url,
            blog: profile.blog,
            bio: profile.bio,
            id: user.uid,
            favorites: [],
          };
          this.users.doc(result.user.uid).set(newUser).then(() => {
            window.localStorage.setItem('rx-user-id', user.uid);
            window.localStorage.setItem('rx-user-token', credential.accessToken);
            return { user: { ...doc.data() }, token: credential.accessToken };
          });
        });
    });
  }

  logOut() {
    return this.auth().signOut();
  }
}

export const fb = new Firebase();

export const { auth } = firebase;
export default firebase.firestore();
