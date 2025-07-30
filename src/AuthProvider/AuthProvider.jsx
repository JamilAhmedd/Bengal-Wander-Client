import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "../../firebase/firebase.init.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";

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
  const userUpdate = (userToUpdate, updatedProfile) => {
    if (!userToUpdate) {
      return Promise.reject(new Error("No user object provided for update."));
    }
    return updateProfile(userToUpdate, updatedProfile)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating profile:", error);
        throw error;
      });
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
      
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
       
      });
  };
  const logOut = () => {
    return signOut(auth).then(() => {
      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#fff",
        color: "#333",
        customClass: {
          popup: "rounded-xl shadow-lg",
        },
      });
    });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setLoading(false);
    });

    return () => {
     
      unsubscribe();
    };
  }, []);
  const authInfo = {
    createAccount,
    forgotPassword,
    logIn,
    logOut,
    signInWithGoogle,
    userUpdate,
    loading,
    user,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
