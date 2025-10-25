import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBLwTmk3FOaW5tPzVMj0dv_ikKchk-TlM",
  authDomain: "prepwise-2a330.firebaseapp.com",
  projectId: "prepwise-2a330",
  storageBucket: "prepwise-2a330.firebasestorage.app",
  messagingSenderId: "780804981315",
  appId: "1:780804981315:web:100510f7a7f9e4007ccaf6",
  measurementId: "G-ZPY2SD4FV8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);