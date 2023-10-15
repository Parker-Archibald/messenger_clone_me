import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBEqqrcvR2WbNhIsYZqnOps9X9Ow-ohV9U",
    authDomain: "messenger-clone-me.firebaseapp.com",
    projectId: "messenger-clone-me",
    storageBucket: "messenger-clone-me.appspot.com",
    messagingSenderId: "344892647003",
    appId: "1:344892647003:web:0f94fdb3a8b0650cdcc17e",
    measurementId: "G-0QWG67PBSY"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export {app, db, storage};