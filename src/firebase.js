// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZvkoTDzk-UOzkcsHkbnrEsWqB4BX9Lsk",
    authDomain: "my-blog-32336.firebaseapp.com",
    projectId: "my-blog-32336",
    storageBucket: "my-blog-32336.firebasestorage.app",
    messagingSenderId: "1081076489319",
    appId: "1:1081076489319:web:2548b096b446fdac0b88c2",
    measurementId: "G-7QB5HTQYFE"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth as named exports
export const db = getFirestore(app);
export const auth = getAuth(app);
