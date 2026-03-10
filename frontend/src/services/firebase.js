import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG53ELp0F2HlRdMUvVUGV5YG0a92W_HUM",
  authDomain: "quizcraft-f47fb.firebaseapp.com",
  projectId: "quizcraft-f47fb",
  storageBucket: "quizcraft-f47fb.appspot.com",
  messagingSenderId: "71053425425",
  appId: "1:71053425425:web:149f9f7afc6bb2025caab0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (THIS WAS MISSING)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
