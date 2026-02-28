import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../fireBaseConfig";

export async function getAll() {
  try {
    const programsSnapshot = await getDocs(collection(db, "programs"));

    return programsSnapshot.docs.map((program) => ({
      id: program.id,
      ...program.data(),
    }));
  } catch (error) {
    console.error(`Error fetching programs ${error.message}`);
    throw new Error(`Failed to fetch therapies, ${error.message}`);
  }
}

export async function getById(id) {
  try {
    const programRef = doc(db, "programs", String(id));
    const snapshot = await getDoc(programRef);

    if (!snapshot.exists()) {
      throw new Error("Program not found");
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error(`Error fetching programs ${error.message}`);
    throw new Error(`${error.message}`);
  }
}
