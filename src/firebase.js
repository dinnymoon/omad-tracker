
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyANXSU5GoaP5XQpTr9-w82dBRqIAs3x1jM",
  authDomain: "omad-tracker-8d6f2.firebaseapp.com",
  projectId: "omad-tracker-8d6f2",
  storageBucket: "omad-tracker-8d6f2.firebasestorage.app",
  messagingSenderId: "826531506231",
  appId: "1:826531506231:web:2be9579b9b4ed1280ab7b2",
  measurementId: "G-YQH5M9B47K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; // ← Dòng này rất quan trọng!