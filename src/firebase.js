import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyCCj46O2uFy8iU24GmAzm1K_KNkobNbql8",
  authDomain: "portfoliomate-mini.firebaseapp.com",
  projectId: "portfoliomate-mini",
  storageBucket: "portfoliomate-mini.firebasestorage.app",
  messagingSenderId: "585532340586",
  appId: "1:585532340586:web:668130af54d70820024d13"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);