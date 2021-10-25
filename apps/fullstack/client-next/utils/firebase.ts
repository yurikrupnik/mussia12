import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDkNplLycBH0qUxIjhTLjcGznie_CyVrOA',
  authDomain: 'mussia8.firebaseapp.com',
  databaseURL: 'https://mussia8-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'mussia8',
  storageBucket: 'mussia8.appspot.com',
  messagingSenderId: '41381952215',
  appId: '1:41381952215:web:6f08f8a08b638932908e92',
};
// if (!firebase.apps.length) {
//   firebase.initializeApp(config);
// }

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: (a: any) => {
      console.log('-------------aAA', a); // eslint-disable-line
      return false;
    },
  },
};

export default firebase;

export { uiConfig };
