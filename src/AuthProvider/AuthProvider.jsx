import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../../firebase/firebase.init.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const createAccount = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  const userUpdate = (updatedProfile) => {
    updateProfile(auth.currentUser, updatedProfile)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const logOut = () => {
    return signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener.");
      unsubscribe();
    };
  }, []);
  const authInfo = {
    createAccount,
    logIn,
    logOut,
    signInWithGoogle,
    userUpdate,
    loading,
    user,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
