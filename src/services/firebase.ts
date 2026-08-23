import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ_6dK9C7p9pQmy9UQJrZNehcpFs65zPM",
  authDomain: "realestate-badd4.firebaseapp.com",
  projectId: "realestate-badd4",
  storageBucket: "realestate-badd4.firebasestorage.app",
  messagingSenderId: "1088837225311",
  appId: "1:1088837225311:web:41a5145f600156ee9c04ea",
  measurementId: "G-F2QM3Q0XKW"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
