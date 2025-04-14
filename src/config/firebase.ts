
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnFstb0vA59ZEVVLHuAkuevtYjL1fkLwU",
  authDomain: "bio-planters.firebaseapp.com",
  projectId: "bio-planters",
  storageBucket: "bio-planters.firebasestorage.app",
  messagingSenderId: "701085761259",
  appId: "1:701085761259:web:34364b9425d601a943c8ae",
  measurementId: "G-50BRER9F3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
