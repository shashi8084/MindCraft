import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCixvDOGSbvB2yaz4Z8Q9wuV7QDROOoZDU",
  authDomain: "mindcraft-quiz-app.firebaseapp.com",
  projectId: "mindcraft-quiz-app",
  storageBucket: "mindcraft-quiz-app.firebasestorage.app",
  messagingSenderId: "205818391347",
  appId: "1:205818391347:web:d62d0dd1db346cc129ec46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (THIS WAS MISSING)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
