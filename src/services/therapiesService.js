import {
  collection,
  getDoc,
  getDocs,
  doc,
  documentId,
  query,
  where,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";

export async function getAll() {
  try {
    const therapiesSnapshot = await getDocs(collection(db, "therapies"));

    return therapiesSnapshot.docs.map((therapy) => ({
      id: therapy.id,
      ...therapy.data(),
    }));
  } catch (error) {
    console.error("Error fetching therapies:", error);
    throw new Error(`Failed to fetch therapies ${error.message}`);
  }
}

export async function getById(id) {
  try {
    const therapyRef = doc(db, "therapies", String(id));
    const snapshot = await getDoc(therapyRef);

    if (!snapshot.exists()) {
      throw new Error("Therapy not found");
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error fetching therapy:", error);
    throw new Error(`Failed to fetch this therapy ${error.message}`);
  }
}

export async function getTherapiesByIds(ids) {
  if (!ids.length) return [];

  try {
    const q = query(
      collection(db, "therapies"),
      where(documentId(), "in", ids),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(
      `Failed loading therapies by therir ids:  + ${error.message}`,
    );
  }
}
