import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  confirmPasswordReset,
  UserCredential,
} from 'firebase/auth';

const AuthContext = createContext({
  currentUser: null,
  // signInWithGoogle: () => Promise,
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  register: (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
  forgotPassword: (email: string) =>
    sendPasswordResetEmail(auth, email, {
      url: `http://localhost:8080/login`,
    }),
  resetPassword: (oobCode, newPassword) =>
    confirmPasswordReset(auth, oobCode, newPassword),
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('The user is', currentUser);
  }, [currentUser]);

  function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function forgotPassword(email: string) {
    return sendPasswordResetEmail(auth, email, {
      url: `http://localhost:3000/login`,
    });
  }

  function resetPassword(oobCode, newPassword: string) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  async function logout() {
    return auth.signOut();
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  const value = {
    currentUser,
    signInWithGoogle,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
