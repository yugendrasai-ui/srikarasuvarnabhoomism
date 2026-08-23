import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Property } from "../types/property";
import { mockProperties } from "../data/mockData";

const COLLECTION = "properties";

// ── Read all properties ──────────────────────────────────────────
export const fetchAllProperties = async (): Promise<Property[]> => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      updatedAt: d.data().updatedAt?.toDate?.() ?? new Date(),
    })) as Property[];
  } catch (err) {
    console.error("Firestore fetchAllProperties error:", err);
    return [];
  }
};

// ── Read single property ─────────────────────────────────────────
export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate?.() ?? new Date(),
      updatedAt: snap.data().updatedAt?.toDate?.() ?? new Date(),
    } as Property;
  } catch (err) {
    console.error("Firestore fetchPropertyById error:", err);
    return null;
  }
};

// ── Add new property ─────────────────────────────────────────────
export const addProperty = async (property: Omit<Property, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...property,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// ── Update property ──────────────────────────────────────────────
export const updateProperty = async (id: string, property: Partial<Property>): Promise<void> => {
  await updateDoc(doc(db, COLLECTION, id), {
    ...property,
    updatedAt: serverTimestamp(),
  });
};

// ── Delete property ──────────────────────────────────────────────
export const deleteProperty = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};

// ── Migrate localStorage → Firestore (one-time use) ─────────────
export const migrateLocalStorageToFirestore = async (): Promise<number> => {
  const stored = localStorage.getItem("admin_properties");
  const properties: Property[] = stored ? JSON.parse(stored) : mockProperties;
  
  if (!properties || properties.length === 0) return 0;
  let count = 0;
  for (const prop of properties) {
    const { id: _id, ...rest } = prop;
    await addDoc(collection(db, COLLECTION), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }
  return count;
};
