import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { mockProperties } from "../src/data/mockData.ts";

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
const db = getFirestore(app);

async function seed() {
  console.log("Checking existing properties...");
  const snap = await getDocs(collection(db, "properties"));
  if (snap.size > 0) {
    console.log(`Database already has ${snap.size} properties. Skipping seed.`);
    return;
  }

  console.log(`Seeding ${mockProperties.length} properties...`);
  for (const prop of mockProperties) {
    const { id, ...rest } = prop;
    await addDoc(collection(db, "properties"), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
