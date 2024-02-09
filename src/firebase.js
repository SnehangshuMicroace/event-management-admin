// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaduRlMb4iarEtDk6fPfTS8W3n4akMDqw",
  authDomain: "event-manager-microace.firebaseapp.com",
  projectId: "event-manager-microace",
  storageBucket: "event-manager-microace.appspot.com",
  messagingSenderId: "524816867083",
  appId: "1:524816867083:web:1c99aaf70fe77e9bb60c0e",
  measurementId: "G-29RPKZ5PMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage(app)
const rdb = getDatabase();
const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

export {
    auth,
    db,
    storage,
    rdb
}