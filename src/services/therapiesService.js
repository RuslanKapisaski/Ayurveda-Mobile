import { collection, getDoc, getDocs, doc } from "firebase/firestore";
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
    throw new Error("Failed to fetch therapies");
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
    console.error("Error fetching therapy:", error, id);
    throw new Error("Failed to fetch this therapy");
  }
}
