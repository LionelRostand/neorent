
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDInXgSvKg0hvD8b57ts400lah99XjZx34",
  authDomain: "neorent-23d85.firebaseapp.com",
  projectId: "neorent-23d85",
  storageBucket: "neorent-23d85.firebasestorage.app",
  messagingSenderId: "312457908893",
  appId: "1:312457908893:web:f625fd27aacf3798e77a74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
