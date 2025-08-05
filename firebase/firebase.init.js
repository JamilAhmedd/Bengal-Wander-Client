// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9CINGFrbdKvZQVDYMCCTiy4UVd5w3bEU",
  authDomain: "bengal-wander.firebaseapp.com",
  projectId: "bengal-wander",
  storageBucket: "bengal-wander.firebasestorage.app",
  messagingSenderId: "853402614192",
  appId: "1:853402614192:web:3e6eb17e610a572747fe75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
