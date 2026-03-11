import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "mindcraft-quiz-app.firebasestorage.app",
  messagingSenderId: "205818391347",
  appId: "1:205818391347:web:d62d0dd1db346cc129ec46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (THIS WAS MISSING)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
