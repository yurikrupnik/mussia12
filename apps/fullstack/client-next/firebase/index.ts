// import firebase from 'firebase/compat/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import config from './config';

const firebaseApp = initializeApp(config);

const auth = getAuth(firebaseApp);

export function logout() {
  auth.signOut();
}

export async function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((r) => {
      return r;
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((r) => {
      return r;
    })
    .catch((err) => {
      console.log(err);
    });
}

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    GithubAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: (a: any) => {
      console.log('-------------aAA', a); // eslint-disable-line
      return false;
    },
  },
};

export { uiConfig, firebaseApp, auth };
