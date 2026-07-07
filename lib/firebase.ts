import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app'; // For legacy support
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyCPC6fvnrLgiIX1swcH9iwqQ4rG97_0A3c",
    authDomain: "anthaathi-9b3b2.firebaseapp.com",
    projectId: "anthaathi-9b3b2",
    storageBucket: "anthaathi-9b3b2.firebasestorage.app",
    messagingSenderId: "988693651434",
    appId: "1:988693651434:web:1b72497ce27256841d9c93",
    measurementId: "G-YKSGPC9TLC"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    firebase.initializeApp(firebaseConfig); // Initialize compat as well
} else {
    app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
